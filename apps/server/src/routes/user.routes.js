import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const userRouter = Router();
userRouter.get("/", requireAuth, asyncHandler(userController.search));
