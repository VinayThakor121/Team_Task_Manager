import { api } from "@/lib/api";
import type { Conversation, Message } from "@/types";

export const chatService = {
  async listConversations() {
    const { data } = await api.get<{ items: Conversation[] }>("/chat");
    return data.items;
  },
  async createDirect(participantId: string) {
    const { data } = await api.post<{ item: Conversation }>("/chat", { participantId });
    return data.item;
  },
  async createGroup(groupName: string, memberIds: string[]) {
    const { data } = await api.post<{ item: Conversation }>("/chat/group", { groupName, memberIds });
    return data.item;
  },
  async renameGroup(id: string, groupName: string) {
    const { data } = await api.patch<{ item: Conversation }>(`/chat/group/${id}`, { groupName });
    return data.item;
  },
  async updateMembers(id: string, memberIds: string[]) {
    const { data } = await api.patch<{ item: Conversation }>(`/chat/group/${id}/members`, { memberIds });
    return data.item;
  },
  async deleteGroup(id: string) {
    await api.delete(`/chat/group/${id}`);
  },
  async getMessages(conversationId: string) {
    const { data } = await api.get<{ items: Message[] }>(`/message/${conversationId}`);
    return data.items;
  },
  async sendMessage(conversationId: string, content: string) {
    const { data } = await api.post<{ item: Message }>("/message", { conversationId, content });
    return data.item;
  },
};
