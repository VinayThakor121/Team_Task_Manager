import { Project } from "../models/Project";
import { ApiError } from "../utils/api-error";

export const projectService = {
  async listProjects(userId: string) {
    return Project.find({ members: userId })
      .populate("createdBy", "name email role")
      .populate("members", "name email role")
      .sort({ updatedAt: -1 });
  },

  async createProject(payload: { title: string; description?: string; memberIds?: string[] }, userId: string) {
    const members = Array.from(new Set([userId, ...(payload.memberIds ?? [])]));

    return Project.create({
      title: payload.title,
      description: payload.description ?? "",
      createdBy: userId,
      members,
    });
  },

  async getProjectById(projectId: string, userId: string) {
    const project = await Project.findOne({ _id: projectId, members: userId })
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    return project;
  },

  async updateProjectMembers(projectId: string, memberIds: string[], userId: string) {
    const project = await Project.findOne({ _id: projectId, createdBy: userId });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    project.members = Array.from(new Set([userId, ...memberIds])) as unknown as typeof project.members;
    await project.save();

    return project.populate("members", "name email role");
  },
};
