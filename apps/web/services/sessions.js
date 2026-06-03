import { api } from "@/lib/api";

const unwrap = (response) => response?.data?.data;

export const sessionService = {
  async start(payload) {
    const { data } = await api.post("/sessions/start", payload);
    return unwrap(data);
  },
  async end(payload) {
    const { data } = await api.post("/sessions/end", payload);
    return unwrap(data);
  },
  async getById(id) {
    const { data } = await api.get(`/sessions/${id}`);
    return unwrap(data);
  },
};
