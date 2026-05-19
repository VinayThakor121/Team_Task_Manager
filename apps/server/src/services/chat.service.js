import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { ApiError } from "../utils/api-error.js";

const conversationBasePopulate = [
  { path: "members", select: "name email role" },
  { path: "admin", select: "name email role" },
  { path: "latestMessage", populate: { path: "sender", select: "name email role" } },
];

export const chatService = {
  async getConversations(userId) {
    const conversations = await Conversation.find({ members: userId })
      .populate(conversationBasePopulate)
      .sort({ updatedAt: -1 });
    const items = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          readBy: { $ne: userId },
        });
        return { ...conversation.toObject(), unreadCount };
      }),
    );
    return items;
  },

  async createDirectConversation(userId, participantId) {
    const existingConversation = await Conversation.findOne({
      isGroupChat: false,
      members: { $all: [userId, participantId], $size: 2 },
    }).populate(conversationBasePopulate);
    if (existingConversation) {
      return existingConversation;
    }
    const conversation = await Conversation.create({
      isGroupChat: false,
      members: [userId, participantId],
    });
    return conversation.populate(conversationBasePopulate);
  },

  async createGroupConversation(payload, userId) {
    const members = Array.from(new Set([userId, ...payload.memberIds]));
    const conversation = await Conversation.create({
      isGroupChat: true,
      groupName: payload.groupName,
      members,
      admin: userId,
    });
    return conversation.populate(conversationBasePopulate);
  },

  async renameGroup(conversationId, groupName, userId) {
    const conversation = await Conversation.findOne({ _id: conversationId, admin: userId, isGroupChat: true });
    if (!conversation) {
      throw new ApiError(404, "Group chat not found");
    }
    conversation.groupName = groupName;
    await conversation.save();
    return conversation.populate(conversationBasePopulate);
  },

  async updateGroupMembers(conversationId, memberIds, userId) {
    const conversation = await Conversation.findOne({ _id: conversationId, admin: userId, isGroupChat: true });
    if (!conversation) {
      throw new ApiError(404, "Group chat not found");
    }
    conversation.members = Array.from(new Set([userId, ...memberIds]));
    await conversation.save();
    return conversation.populate(conversationBasePopulate);
  },

  async deleteGroup(conversationId, userId) {
    const conversation = await Conversation.findOneAndDelete({ _id: conversationId, admin: userId, isGroupChat: true });
    if (!conversation) {
      throw new ApiError(404, "Group chat not found");
    }
    await Message.deleteMany({ conversationId });
    return conversation;
  },

  async getMessages(conversationId, userId) {
    const conversation = await Conversation.findOne({ _id: conversationId, members: userId });
    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }
    const messages = await Message.find({ conversationId })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });
    await Message.updateMany(
      { conversationId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } },
    );
    return messages;
  },

  async sendMessage(payload, userId) {
    const conversation = await Conversation.findOne({ _id: payload.conversationId, members: userId });
    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }
    const message = await Message.create({
      conversationId: payload.conversationId,
      content: payload.content,
      sender: userId,
      readBy: [userId],
    });
    conversation.latestMessage = message._id;
    await conversation.save();
    return message.populate("sender", "name email role");
  },
};
