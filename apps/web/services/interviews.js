import { api } from "@/lib/api";

const unwrap = (response) => response?.data?.data;

export const interviewService = {
  async create(payload) {
    const { data } = await api.post("/interviews/create", payload);
    return unwrap(data);
  },
  async list() {
    const { data } = await api.get("/interviews");
    return unwrap(data) ?? [];
  },
  async getById(id) {
    const { data } = await api.get(`/interviews/${id}`);
    return unwrap(data);
  },
  async remove(id) {
    const { data } = await api.delete(`/interviews/${id}`);
    return unwrap(data);
  },
};
