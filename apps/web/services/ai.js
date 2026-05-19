import { api } from "@/lib/api";

export const aiService = {
  async generateSubtasks(payload) {
    const { data } = await api.post("/ai/generate-subtasks", payload);
    return data.subtasks;
  },
};
