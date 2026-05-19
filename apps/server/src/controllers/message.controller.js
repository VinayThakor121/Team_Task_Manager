import { chatService } from "../services/chat.service.js";

export const messageController = {
  async list(req, res) {
    const items = await chatService.getMessages(String(req.params.conversationId), String(req.user._id));
    res.json({ items });
  },
  async create(req, res) {
    const item = await chatService.sendMessage(req.body, String(req.user._id));
    const io = req.app.get("io");
    io?.to(req.body.conversationId).emit("message:new", item);
    res.status(201).json({ item });
  },
};
