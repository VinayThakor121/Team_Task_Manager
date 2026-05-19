import type { Request, Response } from "express";
import { aiService } from "../services/ai.service";

export const aiController = {
  async generateSubtasks(req: Request, res: Response) {
    const result = await aiService.generateSubtasks(req.body.title, req.body.description);
    res.json(result);
  },
};
