import { chatService } from "../services/chat.service.js";
import { taskService } from "../services/task.service.js";

export const dashboardController = {
  async summary(req, res) {
    const [summary, recentChats] = await Promise.all([
      taskService.getDashboardSummary(String(req.user._id)),
      chatService.getConversations(String(req.user._id)),
    ]);
    res.json({ ...summary, recentChats: recentChats.slice(0, 5) });
  },
};
