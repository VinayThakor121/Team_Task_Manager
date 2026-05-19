import { taskService } from "../services/task.service.js";

export const taskController = {
  async list(req, res) {
    const result = await taskService.listTasks(String(req.user._id), req.query);
    res.json(result);
  },
  async create(req, res) {
    const task = await taskService.createTask(req.body, String(req.user._id));
    res.status(201).json({ item: task });
  },
  async update(req, res) {
    const task = await taskService.updateTask(String(req.params.id), req.body, String(req.user._id), req.user.role);
    res.json({ item: task });
  },
  async remove(req, res) {
    await taskService.deleteTask(String(req.params.id), String(req.user._id));
    res.status(204).send();
  },
};
