import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { HttpError } from "../utils/httpError.js";

function getMemberUserId(member) {
  if (!member.user) {
    return "";
  }

  return (member.user._id || member.user).toString();
}

function getMemberEmail(member) {
  return (member.user?.email || member.email || "").toLowerCase();
}

export async function listProjects(request, response) {
  const projects = await Project.find({ "members.user": request.user._id })
    .populate("members.user", "name email avatar")
    .sort({ updatedAt: -1 });

  response.json({ projects });
}

export async function createProject(request, response) {
  const project = await Project.create({
    ...request.body,
    owner: request.user._id,
    members: [{ user: request.user._id, role: "Admin" }]
  });

  await project.populate("members.user", "name email avatar");
  response.status(201).json({ project });
}

export async function getProject(request, response) {
  response.json({ project: request.project });
}

export async function updateProject(request, response) {
  request.project.name = request.body.name ?? request.project.name;
  request.project.description = request.body.description ?? request.project.description;
  await request.project.save();
  await request.project.populate("members.user", "name email avatar");
  response.json({ project: request.project });
}

export async function deleteProject(request, response) {
  await Task.deleteMany({ project: request.project._id });
  await request.project.deleteOne();
  response.status(204).send();
}

export async function addMember(request, response) {
  const email = request.body.email.toLowerCase().trim();
  const role = request.body.role || "Member";

  const user = await User.findOne({ email });

  const alreadyMember = request.project.members.some((member) => {
    if (user && getMemberUserId(member) === user._id.toString()) {
      return true;
    }

    return getMemberEmail(member) === email;
  });

  if (alreadyMember) {
    throw new HttpError(409, "Member already exists in this project");
  }

  if (user) {
    request.project.members.push({
      user: user._id,
      name: user.name,
      email: user.email,
      role
    });
  } else {
    if (!request.body.name) {
      throw new HttpError(400, "Name is required for external members");
    }

    request.project.members.push({
      name: request.body.name,
      email,
      role
    });
  }

  await request.project.save();

  await request.project.populate(
    "members.user",
    "name email avatar"
  );

  response.status(201).json({
    project: request.project
  });
}

export async function updateMemberRole(request, response) {
  const member = request.project.members.id(request.params.memberId);

  if (!member) {
    throw new HttpError(404, "Member not found");
  }

  const adminCount = request.project.members.filter((projectMember) => projectMember.role === "Admin").length;

  if (member.role === "Admin" && request.body.role === "Member" && adminCount === 1) {
    throw new HttpError(400, "A project needs at least one admin");
  }

  member.role = request.body.role;
  await request.project.save();
  await request.project.populate("members.user", "name email avatar");
  response.json({ project: request.project });
}

export async function removeMember(request, response) {
  const member = request.project.members.id(request.params.memberId);

  if (!member) {
    throw new HttpError(404, "Member not found");
  }

  const adminCount = request.project.members.filter((projectMember) => projectMember.role === "Admin").length;

  if (member.role === "Admin" && adminCount === 1) {
    throw new HttpError(400, "A project needs at least one admin");
  }

  if (member.user) {
    await Task.updateMany({ project: request.project._id, assignee: getMemberUserId(member) }, { $unset: { assignee: "" } });
  }

  member.deleteOne();
  await request.project.save();
  await request.project.populate("members.user", "name email avatar");
  response.json({ project: request.project });
}

export async function searchUsers(request, response) {
  const query = request.query.q || "";
  const projectId = request.params.projectId;

  if (!query.trim()) {
    throw new HttpError(400, "Search query required");
  }

  const searchRegex = new RegExp(query, "i");
  const users = await User.find({
    $or: [{ name: searchRegex }, { email: searchRegex }]
  })
    .select("_id name email avatar")
    .limit(10);

  // Filter out current user and project members
  const project = await Project.findById(projectId);
  const memberIds = project.members.map((member) => getMemberUserId(member)).filter(Boolean);
  const filteredUsers = users.filter((user) => user._id.toString() !== request.user._id.toString() && !memberIds.includes(user._id.toString()));

  response.json({ users: filteredUsers });
}

