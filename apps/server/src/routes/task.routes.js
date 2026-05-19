import { Router } from "express";
import { taskController } from "../controllers/task.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validator.js";

export const taskRouter = Router();
taskRouter.use(requireAuth);
taskRouter.get("/", asyncHandler(taskController.list));
taskRouter.post("/", authorize("admin"), validate(createTaskSchema), asyncHandler(taskController.create));
taskRouter.patch("/:id", validate(updateTaskSchema), asyncHandler(taskController.update));
taskRouter.delete("/:id", authorize("admin"), asyncHandler(taskController.remove));
