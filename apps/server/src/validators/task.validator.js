import { z } from "zod";

const taskStatus = z.enum(["Todo", "In Progress", "Completed"]);
const taskPriority = z.enum(["Low", "Medium", "High"]);

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    subtasks: z.array(z.string()).optional(),
    assignedTo: z.string().min(1),
    projectId: z.string().min(1),
    priority: taskPriority.optional(),
    status: taskStatus.optional(),
    dueDate: z.string().datetime(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    subtasks: z.array(z.string()).optional(),
    assignedTo: z.string().optional(),
    projectId: z.string().optional(),
    priority: taskPriority.optional(),
    status: taskStatus.optional(),
    dueDate: z.string().datetime().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});
