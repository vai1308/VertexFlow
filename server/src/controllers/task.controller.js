import { Task } from "../models/task.model.js";
import { HttpError } from "../utils/httpError.js";

function normalizeTaskPayload(body) {
  const payload = { ...body };

  if (Object.hasOwn(payload, "dueDate")) {
    payload.dueDate = payload.dueDate ? new Date(payload.dueDate) : undefined;
  }

  if (Object.hasOwn(payload, "assignee")) {
    payload.assignee = payload.assignee || undefined;
  }

  return payload;
}

function isProjectMember(project, userId) {
  return project.members.some((member) => {
    if (!member.user) {
      return false;
    }

    return (member.user._id || member.user).toString() === userId.toString();
  });
}

export async function listTasks(request, response) {
  const tasks = await Task.find({ project: request.project._id })
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar")
    .sort({ createdAt: -1 });

  response.json({ tasks });
}

export async function createTask(request, response) {
  const payload = normalizeTaskPayload(request.body);

  if (payload.assignee && !isProjectMember(request.project, payload.assignee)) {
    throw new HttpError(400, "Assignee must be a project member");
  }

  const task = await Task.create({
    ...payload,
    project: request.project._id,
    createdBy: request.user._id
  });

  await task.populate("assignee", "name email avatar");
  await task.populate("createdBy", "name email avatar");
  response.status(201).json({ task });
}

export async function updateTask(request, response) {
  const task = await Task.findOne({ _id: request.params.taskId, project: request.project._id });

  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  if (request.membership.role !== "Admin") {
    const allowedKeys = ["status"];
    const requestedKeys = Object.keys(request.body);
    const onlyStatusChanged = requestedKeys.length === 1 && allowedKeys.includes(requestedKeys[0]);

    if (!onlyStatusChanged) {
      throw new HttpError(403, "Members can only update task status");
    }
  }

  const payload = normalizeTaskPayload(request.body);

  if (payload.assignee && !isProjectMember(request.project, payload.assignee)) {
    throw new HttpError(400, "Assignee must be a project member");
  }

  Object.assign(task, payload);
  await task.save();
  await task.populate("assignee", "name email avatar");
  await task.populate("createdBy", "name email avatar");
  response.json({ task });
}

export async function deleteTask(request, response) {
  const task = await Task.findOne({ _id: request.params.taskId, project: request.project._id });

  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  await task.deleteOne();
  response.status(204).send();
}
