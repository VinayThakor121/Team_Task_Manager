import { Router } from "express";
import { messageController } from "../controllers/message.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { createMessageSchema } from "../validators/chat.validator";

export const messageRouter = Router();

messageRouter.use(requireAuth);
messageRouter.get("/:conversationId", asyncHandler(messageController.list));
messageRouter.post("/", validate(createMessageSchema), asyncHandler(messageController.create));
