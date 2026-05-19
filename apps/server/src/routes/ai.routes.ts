import { Router } from "express";
import { aiController } from "../controllers/ai.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { generateSubtasksSchema } from "../validators/ai.validator";

export const aiRouter = Router();

aiRouter.post("/generate-subtasks", requireAuth, validate(generateSubtasksSchema), asyncHandler(aiController.generateSubtasks));
