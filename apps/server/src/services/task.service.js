import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { ApiError } from "../utils/api-error.js";

const buildScope = async (userId) => {
  const projectIds = await Project.find({ members: userId }).distinct("_id");
  return {
    $or: [
      { createdBy: userId },
      { assignedTo: userId },
      { projectId: { $in: projectIds } },
    ],
  };
};

export const taskService = {
  async createTask(payload, userId) {
    const project = await Project.findOne({ _id: payload.projectId, members: payload.assignedTo });
    if (!project) {
      throw new ApiError(400, "Assigned user must belong to the selected project");
    }
    return Task.create({
      ...payload,
      createdBy: userId,
      dueDate: new Date(payload.dueDate),
    });
  },

  async listTasks(userId, query) {
    const scope = await buildScope(userId);
    const filters = { ...scope };

    if (query.status) filters.status = query.status;
    if (query.priority) filters.priority = query.priority;
    if (query.assignedTo) filters.assignedTo = query.assignedTo;
    if (query.projectId) filters.projectId = query.projectId;

    if (query.search) {
      const existingAnd = Array.isArray(filters.$and) ? filters.$and : [];
      filters.$and = [
        ...existingAnd,
        {
          $or: [
            { title: { $regex: query.search, $options: "i" } },
            { description: { $regex: query.search, $options: "i" } },
          ],
        },
      ];
    }

    if (query.dueDate) {
      const targetDate = new Date(query.dueDate);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filters.dueDate = { $gte: targetDate, $lt: nextDay };
    }

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Task.find(filters)
        .populate("assignedTo", "name email role")
        .populate("projectId", "title")
        .populate("createdBy", "name email role")
        .sort({ dueDate: 1, updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filters),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getTasksForProject(projectId, userId) {
    const scope = await buildScope(userId);
    return Task.find({ ...scope, projectId })
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .sort({ dueDate: 1, updatedAt: -1 });
  },

  async updateTask(taskId, updates, userId, role) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    if (role === "member") {
      if (String(task.assignedTo) !== userId) {
        throw new ApiError(403, "You can only update tasks assigned to you");
      }
      task.status = String(updates.status ?? task.status);
      await task.save();
      return task;
    }
    Object.assign(task, updates);
    if (updates.dueDate) {
      task.dueDate = new Date(String(updates.dueDate));
    }
    await task.save();
    return task;
  },

  async deleteTask(taskId, userId) {
    const deleted = await Task.findOneAndDelete({ _id: taskId, createdBy: userId });
    if (!deleted) {
      throw new ApiError(404, "Task not found");
    }
    return deleted;
  },

  async getDashboardSummary(userId) {
    const scope = await buildScope(userId);
    const now = new Date();

    const [allTasks, completedTasks, pendingTasks, overdueTasks, assignedToMe, recentTasks] = await Promise.all([
      Task.countDocuments(scope),
      Task.countDocuments({ ...scope, status: "Completed" }),
      Task.countDocuments({ ...scope, status: { $ne: "Completed" } }),
      Task.countDocuments({ ...scope, status: { $ne: "Completed" }, dueDate: { $lt: now } }),
      Task.countDocuments({ assignedTo: userId }),
      Task.find(scope)
        .populate("assignedTo", "name email role")
        .populate("projectId", "title")
        .sort({ updatedAt: -1 })
        .limit(5),
    ]);

    const statusBreakdown = {
      todo: await Task.countDocuments({ ...scope, status: "Todo" }),
      inProgress: await Task.countDocuments({ ...scope, status: "In Progress" }),
      completed: completedTasks,
    };

    return {
      metrics: { totalTasks: allTasks, completedTasks, pendingTasks, overdueTasks, assignedToMe },
      statusBreakdown,
      recentTasks,
    };
  },
};
