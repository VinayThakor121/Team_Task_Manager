import { api } from "@/lib/api";

export const userService = {
  async search(search = "") {
    const { data } = await api.get("/users", { params: { search } });
    return data.items;
  },
};
