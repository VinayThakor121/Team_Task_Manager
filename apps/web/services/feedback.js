import { api } from "@/lib/api";

const unwrap = (response) => response?.data?.data;

export const feedbackService = {
  async generate(payload) {
    const { data } = await api.post("/feedback/generate", payload);
    return unwrap(data);
  },
  async getByInterviewId(interviewId) {
    const { data } = await api.get(`/feedback/${interviewId}`);
    return unwrap(data);
  },
};
