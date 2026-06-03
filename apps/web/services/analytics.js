import { api } from "@/lib/api";

const unwrap = (response) => response?.data;

export const analyticsService = {
  async dashboard() {
    const { data } = await api.get("/analytics/dashboard");
    return unwrap(data);
  },
  async performance() {
    const { data } = await api.get("/analytics/performance");
    return unwrap(data);
  },
  async leaderboard() {
    const { data } = await api.get("/analytics/leaderboard");
    return unwrap(data) ?? [];
  },
};
