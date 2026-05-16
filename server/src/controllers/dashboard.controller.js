import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";

export async function getDashboard(request, response) {
  const projects = await Project.find({ "members.user": request.user._id }).select("_id name members updatedAt");
  const projectIds = projects.map((project) => project._id);
  const now = new Date();

  const tasks = await Task.find({ project: { $in: projectIds } })
    .populate("assignee", "name email avatar")
    .populate("project", "name")
    .sort({ dueDate: 1 });

  const summary = {
    projects: projects.length,
    tasks: tasks.length,
    pending: tasks.filter((task) => task.status === "Pending").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    completed: tasks.filter((task) => task.status === "Completed").length,
    overdue: tasks.filter((task) => task.dueDate && task.dueDate < now && task.status !== "Completed").length
  };

  const overdueTasks = tasks.filter((task) => task.dueDate && task.dueDate < now && task.status !== "Completed").slice(0, 8);
  const recentTasks = tasks.slice(0, 8);

  response.json({ summary, overdueTasks, recentTasks });
}
