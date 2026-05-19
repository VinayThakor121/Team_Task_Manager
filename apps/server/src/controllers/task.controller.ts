import type { Request, Response } from "express";
import { taskService } from "../services/task.service";

export const taskController = {
  async list(req: Request, res: Response) {
    const result = await taskService.listTasks(String(req.user!._id), req.query as Record<string, string | undefined>);
    res.json(result);
  },

  async create(req: Request, res: Response) {
    const task = await taskService.createTask(req.body, String(req.user!._id));
    res.status(201).json({ item: task });
  },

  async update(req: Request, res: Response) {
    const task = await taskService.updateTask(String(req.params.id), req.body, String(req.user!._id), req.user!.role);
    res.json({ item: task });
  },

  async remove(req: Request, res: Response) {
    await taskService.deleteTask(String(req.params.id), String(req.user!._id));
    res.status(204).send();
  },
};
