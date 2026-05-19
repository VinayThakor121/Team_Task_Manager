import { api } from "@/lib/api";
import type { AuthResponse, User } from "@/types";

export const authService = {
  async login(payload: { email: string; password: string }) {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },
  async register(payload: { name: string; email: string; password: string; role: "admin" | "member" }) {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },
  async me() {
    const { data } = await api.get<{ user: User }>("/auth/me");
    return data.user;
  },
};
