import { projectService } from "../services/project.service.js";
import { taskService } from "../services/task.service.js";

export const projectController = {
  async list(req, res) {
    const items = await projectService.listProjects(String(req.user._id));
    res.json({ items });
  },
  async create(req, res) {
    const project = await projectService.createProject(req.body, String(req.user._id));
    res.status(201).json({ item: project });
  },
  async getById(req, res) {
    const [project, tasks] = await Promise.all([
      projectService.getProjectById(String(req.params.id), String(req.user._id)),
      taskService.getTasksForProject(String(req.params.id), String(req.user._id)),
    ]);
    res.json({ item: project, tasks });
  },
  async updateMembers(req, res) {
    const project = await projectService.updateProjectMembers(String(req.params.id), req.body.memberIds, String(req.user._id));
    res.json({ item: project });
  },
};
