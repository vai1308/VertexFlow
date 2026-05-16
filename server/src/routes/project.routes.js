import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectAccess } from "../middleware/projectAccess.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { memberRoleSchema, memberSchema, projectSchema } from "../validators/project.validators.js";
import {
  addMember,
  createProject,
  deleteProject,
  getProject,
  listProjects,
  removeMember,
  updateMemberRole,
  updateProject,
  searchUsers
} from "../controllers/project.controller.js";
import { createTask, deleteTask, listTasks, updateTask } from "../controllers/task.controller.js";
import { taskSchema, taskUpdateSchema } from "../validators/task.validators.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listProjects));
router.post("/", validate(projectSchema), asyncHandler(createProject));
router.get("/:projectId", requireProjectAccess(), asyncHandler(getProject));
router.get("/:projectId/search-users", requireProjectAccess(["Admin"]), asyncHandler(searchUsers));
router.patch("/:projectId", requireProjectAccess(["Admin"]), validate(projectSchema.partial()), asyncHandler(updateProject));
router.delete("/:projectId", requireProjectAccess(["Admin"]), asyncHandler(deleteProject));
router.post("/:projectId/members", requireProjectAccess(["Admin"]), validate(memberSchema), asyncHandler(addMember));
router.patch("/:projectId/members/:memberId", requireProjectAccess(["Admin"]), validate(memberRoleSchema), asyncHandler(updateMemberRole));
router.delete("/:projectId/members/:memberId", requireProjectAccess(["Admin"]), asyncHandler(removeMember));
router.get("/:projectId/tasks", requireProjectAccess(), asyncHandler(listTasks));
router.post("/:projectId/tasks", requireProjectAccess(["Admin"]), validate(taskSchema), asyncHandler(createTask));
router.patch("/:projectId/tasks/:taskId", requireProjectAccess(), validate(taskUpdateSchema), asyncHandler(updateTask));
router.delete("/:projectId/tasks/:taskId", requireProjectAccess(["Admin"]), asyncHandler(deleteTask));

export default router;
