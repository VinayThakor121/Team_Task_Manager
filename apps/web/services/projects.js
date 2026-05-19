import { api } from "@/lib/api";

export const projectService = {
  async list() {
    const { data } = await api.get("/projects");
    return data.items;
  },
  async create(payload) {
    const { data } = await api.post("/projects", payload);
    return data.item;
  },
  async getById(id) {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },
  async updateMembers(id, memberIds) {
    const { data } = await api.patch(`/projects/${id}/members`, { memberIds });
    return data.item;
  },
};
