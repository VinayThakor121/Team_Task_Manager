import { Router } from "express";
import { aiController } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { generateSubtasksSchema } from "../validators/ai.validator.js";

export const aiRouter = Router();
aiRouter.post("/generate-subtasks", requireAuth, validate(generateSubtasksSchema), asyncHandler(aiController.generateSubtasks));
