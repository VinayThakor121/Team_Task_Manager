import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

export const userRouter = Router();

userRouter.get("/", requireAuth, asyncHandler(userController.search));
