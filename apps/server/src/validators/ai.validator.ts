import { z } from "zod";

export const generateSubtasksSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
