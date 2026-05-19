import type { Request, Response } from "express";
import { chatService } from "../services/chat.service";
import { taskService } from "../services/task.service";

export const dashboardController = {
  async summary(req: Request, res: Response) {
    const [summary, recentChats] = await Promise.all([
      taskService.getDashboardSummary(String(req.user!._id)),
      chatService.getConversations(String(req.user!._id)),
    ]);

    res.json({
      ...summary,
      recentChats: recentChats.slice(0, 5),
    });
  },
};
