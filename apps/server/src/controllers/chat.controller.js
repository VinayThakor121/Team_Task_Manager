import { chatService } from "../services/chat.service.js";

export const chatController = {
  async list(req, res) {
    const items = await chatService.getConversations(String(req.user._id));
    res.json({ items });
  },
  async createDirect(req, res) {
    const item = await chatService.createDirectConversation(String(req.user._id), req.body.participantId);
    res.status(201).json({ item });
  },
  async createGroup(req, res) {
    const item = await chatService.createGroupConversation(req.body, String(req.user._id));
    res.status(201).json({ item });
  },
  async renameGroup(req, res) {
    const item = await chatService.renameGroup(String(req.params.id), req.body.groupName, String(req.user._id));
    res.json({ item });
  },
  async updateGroupMembers(req, res) {
    const item = await chatService.updateGroupMembers(String(req.params.id), req.body.memberIds, String(req.user._id));
    res.json({ item });
  },
  async deleteGroup(req, res) {
    await chatService.deleteGroup(String(req.params.id), String(req.user._id));
    res.status(204).send();
  },
};
