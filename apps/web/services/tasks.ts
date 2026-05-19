import { api } from "@/lib/api";
import type { Task } from "@/types";

export const taskService = {
  async list(params?: Record<string, string>) {
    const { data } = await api.get<{ items: Task[]; total: number; page: number; totalPages: number }>("/tasks", { params });
    return data;
  },
  async create(payload: {
    title: string;
    description?: string;
    subtasks?: string[];
    assignedTo: string;
    projectId: string;
    priority: "Low" | "Medium" | "High";
    status: "Todo" | "In Progress" | "Completed";
    dueDate: string;
  }) {
    const { data } = await api.post<{ item: Task }>("/tasks", payload);
    return data.item;
  },
  async update(id: string, payload: Partial<Task>) {
    const { data } = await api.patch<{ item: Task }>(`/tasks/${id}`, payload);
    return data.item;
  },
  async remove(id: string) {
    await api.delete(`/tasks/${id}`);
  },
};
