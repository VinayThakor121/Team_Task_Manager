import { api } from "@/lib/api";

export const dashboardService = {
  async getSummary() {
    const { data } = await api.get("/dashboard/summary");
    return data;
  },
};
