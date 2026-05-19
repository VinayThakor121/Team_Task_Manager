import { api } from "@/lib/api";

export const taskService = {
  async list(params) {
    const { data } = await api.get("/tasks", { params });
    return data;
  },
  async create(payload) {
    const { data } = await api.post("/tasks", payload);
    return data.item;
  },
  async update(id, payload) {
    const { data } = await api.patch(`/tasks/${id}`, payload);
    return data.item;
  },
  async remove(id) {
    await api.delete(`/tasks/${id}`);
  },
};
