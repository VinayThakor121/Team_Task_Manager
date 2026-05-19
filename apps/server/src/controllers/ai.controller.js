import { aiService } from "../services/ai.service.js";

export const aiController = {
  async generateSubtasks(req, res) {
    const result = await aiService.generateSubtasks(req.body.title, req.body.description);
    res.json(result);
  },
};
