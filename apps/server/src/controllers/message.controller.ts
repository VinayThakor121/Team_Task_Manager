import type { Request, Response } from "express";
import { chatService } from "../services/chat.service";

export const messageController = {
  async list(req: Request, res: Response) {
    const items = await chatService.getMessages(String(req.params.conversationId), String(req.user!._id));
    res.json({ items });
  },

  async create(req: Request, res: Response) {
    const item = await chatService.sendMessage(req.body, String(req.user!._id));

    const io = req.app.get("io");
    io?.to(req.body.conversationId).emit("message:new", item);

    res.status(201).json({ item });
  },
};
