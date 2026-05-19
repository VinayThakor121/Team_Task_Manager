import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { requireAuth } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validator";

export const taskRouter = Router();

taskRouter.use(requireAuth);
taskRouter.get("/", asyncHandler(taskController.list));
taskRouter.post("/", authorize("admin"), validate(createTaskSchema), asyncHandler(taskController.create));
taskRouter.patch("/:id", validate(updateTaskSchema), asyncHandler(taskController.update));
taskRouter.delete("/:id", authorize("admin"), asyncHandler(taskController.remove));
