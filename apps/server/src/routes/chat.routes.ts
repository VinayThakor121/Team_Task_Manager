import { Router } from "express";
import { chatController } from "../controllers/chat.controller";
import { requireAuth } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import {
  createDirectChatSchema,
  createGroupChatSchema,
  updateGroupMembersSchema,
  updateGroupNameSchema,
} from "../validators/chat.validator";

export const chatRouter = Router();

chatRouter.use(requireAuth);
chatRouter.get("/", asyncHandler(chatController.list));
chatRouter.post("/", validate(createDirectChatSchema), asyncHandler(chatController.createDirect));
chatRouter.post("/group", authorize("admin"), validate(createGroupChatSchema), asyncHandler(chatController.createGroup));
chatRouter.patch("/group/:id", authorize("admin"), validate(updateGroupNameSchema), asyncHandler(chatController.renameGroup));
chatRouter.patch("/group/:id/members", authorize("admin"), validate(updateGroupMembersSchema), asyncHandler(chatController.updateGroupMembers));
chatRouter.delete("/group/:id", authorize("admin"), asyncHandler(chatController.deleteGroup));
