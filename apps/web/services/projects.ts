import { api } from "@/lib/api";
import type { Project, Task } from "@/types";

export const projectService = {
  async list() {
    const { data } = await api.get<{ items: Project[] }>("/projects");
    return data.items;
  },
  async create(payload: { title: string; description?: string; memberIds?: string[] }) {
    const { data } = await api.post<{ item: Project }>("/projects", payload);
    return data.item;
  },
  async getById(id: string) {
    const { data } = await api.get<{ item: Project; tasks: Task[] }>(`/projects/${id}`);
    return data;
  },
  async updateMembers(id: string, memberIds: string[]) {
    const { data } = await api.patch<{ item: Project }>(`/projects/${id}/members`, { memberIds });
    return data.item;
  },
};
