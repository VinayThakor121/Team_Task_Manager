import { Router } from "express";
import { messageController } from "../controllers/message.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { createMessageSchema } from "../validators/chat.validator.js";

export const messageRouter = Router();
messageRouter.use(requireAuth);
messageRouter.get("/:conversationId", asyncHandler(messageController.list));
messageRouter.post("/", validate(createMessageSchema), asyncHandler(messageController.create));
