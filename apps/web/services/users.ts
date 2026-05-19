import { api } from "@/lib/api";
import type { User } from "@/types";

export const userService = {
  async search(search = "") {
    const { data } = await api.get<{ items: User[] }>("/users", { params: { search } });
    return data.items;
  },
};
