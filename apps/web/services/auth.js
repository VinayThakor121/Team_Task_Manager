import { api } from "@/lib/api";

const unwrap = (response) => response?.data;

export const authService = {
  async login(payload) {
    const { data } = await api.post("/auth/login", payload);
    return unwrap(data);
  },
  async signup(payload) {
    const { data } = await api.post("/auth/signup", payload);
    return unwrap(data);
  },
  async profile() {
    const { data } = await api.get("/auth/profile");
    return unwrap(data);
  },
  async updateProfile(payload) {
    const { data } = await api.put("/auth/profile", payload);
    return unwrap(data);
  },
  async changePassword(payload) {
    const { data } = await api.post("/auth/change-password", payload);
    return unwrap(data);
  },
};
