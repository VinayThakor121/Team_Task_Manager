import { Router } from "express";
import { projectController } from "../controllers/project.controller";
import { requireAuth } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";
import { createProjectSchema, updateProjectMembersSchema } from "../validators/project.validator";

export const projectRouter = Router();

projectRouter.use(requireAuth);
projectRouter.get("/", asyncHandler(projectController.list));
projectRouter.get("/:id", asyncHandler(projectController.getById));
projectRouter.post("/", authorize("admin"), validate(createProjectSchema), asyncHandler(projectController.create));
projectRouter.patch("/:id/members", authorize("admin"), validate(updateProjectMembersSchema), asyncHandler(projectController.updateMembers));
