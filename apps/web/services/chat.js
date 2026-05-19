import { api } from "@/lib/api";

export const chatService = {
  async listConversations() {
    const { data } = await api.get("/chat");
    return data.items;
  },
  async createDirect(participantId) {
    const { data } = await api.post("/chat", { participantId });
    return data.item;
  },
  async createGroup(groupName, memberIds) {
    const { data } = await api.post("/chat/group", { groupName, memberIds });
    return data.item;
  },
  async renameGroup(id, groupName) {
    const { data } = await api.patch(`/chat/group/${id}`, { groupName });
    return data.item;
  },
  async updateMembers(id, memberIds) {
    const { data } = await api.patch(`/chat/group/${id}/members`, { memberIds });
    return data.item;
  },
  async deleteGroup(id) {
    await api.delete(`/chat/group/${id}`);
  },
  async getMessages(conversationId) {
    const { data } = await api.get(`/message/${conversationId}`);
    return data.items;
  },
  async sendMessage(conversationId, content) {
    const { data } = await api.post("/message", { conversationId, content });
    return data.item;
  },
};
