import type { Request, Response } from "express";
import { projectService } from "../services/project.service";
import { taskService } from "../services/task.service";

export const projectController = {
  async list(req: Request, res: Response) {
    const items = await projectService.listProjects(String(req.user!._id));
    res.json({ items });
  },

  async create(req: Request, res: Response) {
    const project = await projectService.createProject(req.body, String(req.user!._id));
    res.status(201).json({ item: project });
  },

  async getById(req: Request, res: Response) {
    const [project, tasks] = await Promise.all([
      projectService.getProjectById(String(req.params.id), String(req.user!._id)),
      taskService.getTasksForProject(String(req.params.id), String(req.user!._id)),
    ]);

    res.json({ item: project, tasks });
  },

  async updateMembers(req: Request, res: Response) {
    const project = await projectService.updateProjectMembers(String(req.params.id), req.body.memberIds, String(req.user!._id));
    res.json({ item: project });
  },
};
