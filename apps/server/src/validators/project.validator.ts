import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    memberIds: z.array(z.string()).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateProjectMembersSchema = z.object({
  body: z.object({
    memberIds: z.array(z.string()).min(1),
  }),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
});
