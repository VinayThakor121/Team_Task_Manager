import { Router } from "express";
import { projectController } from "../controllers/project.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { createProjectSchema, updateProjectMembersSchema } from "../validators/project.validator.js";

export const projectRouter = Router();
projectRouter.use(requireAuth);
projectRouter.get("/", asyncHandler(projectController.list));
projectRouter.get("/:id", asyncHandler(projectController.getById));
projectRouter.post("/", authorize("admin"), validate(createProjectSchema), asyncHandler(projectController.create));
projectRouter.patch("/:id/members", authorize("admin"), validate(updateProjectMembersSchema), asyncHandler(projectController.updateMembers));
