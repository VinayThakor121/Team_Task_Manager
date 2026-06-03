import { api } from "@/lib/api";

const unwrap = (response) => response?.data?.data;

export const resumeService = {
  async upload(file) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap(data);
  },
  async list() {
    const { data } = await api.get("/resumes");
    return unwrap(data) ?? [];
  },
};
