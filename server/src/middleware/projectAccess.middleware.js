import { Project } from "../models/project.model.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export function requireProjectAccess(allowedRoles = ["Admin", "Member"]) {
  return asyncHandler(async (request, response, next) => {
    const project = await Project.findById(request.params.projectId).populate("members.user", "name email avatar");

    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    const membership = project.members.find((member) => {
      return member.user?._id?.toString() === request.user._id.toString();
    });

    if (!membership || !allowedRoles.includes(membership.role)) {
      throw new HttpError(403, "You do not have access to this project");
    }

    request.project = project;
    request.membership = membership;
    next();
  });
}
