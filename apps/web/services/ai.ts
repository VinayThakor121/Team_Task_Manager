import { api } from "@/lib/api";

export const aiService = {
  async generateSubtasks(payload: { title: string; description?: string }) {
    const { data } = await api.post<{ subtasks: string[] }>("/ai/generate-subtasks", payload);
    return data.subtasks;
  },
};
