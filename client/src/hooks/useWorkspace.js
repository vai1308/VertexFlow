import { useEffect, useMemo, useState } from "react";
import { api, clearSession, getSavedUser, getToken, patch, post, remove, saveSession } from "../api.js";
import { createEmptyTask } from "../constants/tasks.js";

export function useWorkspace() {
  const [user, setUser] = useState(getSavedUser);
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(getToken()));

  const currentRole = useMemo(() => {
    if (!activeProject || !user) {
      return "Member";
    }

    return activeProject.members.find((member) => member.user?._id === user.id)?.role || "Member";
  }, [activeProject, user]);

  const canManage = currentRole === "Admin";

  useEffect(() => {
    if (user) {
      loadWorkspace();
      return;
    }

    setLoading(false);
  }, [user]);

  async function loadWorkspace(preferredProjectId) {
    try {
      setLoading(true);
      const [projectData, dashboardData] = await Promise.all([api("/projects"), api("/dashboard")]);
      setProjects(projectData.projects);
      setDashboard(dashboardData);

      const nextProjectId = preferredProjectId || activeProject?._id || projectData.projects[0]?._id;

      if (nextProjectId) {
        await openProject(nextProjectId);
      } else {
        setActiveProject(null);
        setTasks([]);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshDashboard() {
    const dashboardData = await api("/dashboard");
    setDashboard(dashboardData);
  }

  async function openProject(projectId) {
    const [projectData, taskData] = await Promise.all([api(`/projects/${projectId}`), api(`/projects/${projectId}/tasks`)]);
    setActiveProject(projectData.project);
    setTasks(taskData.tasks);
  }

  async function loginWithEmail(authMode, authForm) {
    setError("");
    const path = authMode === "login" ? "/auth/login" : "/auth/signup";
    const body = authMode === "login" ? { email: authForm.email, password: authForm.password } : authForm;
    const result = await post(path, body);

    if (!result.token) {
      return result;
    }

    saveSession(result);
    setUser(result.user);
    return result;
  }

  async function verifyEmail(token) {
    setError("");
    const session = await post("/auth/verify-email", { token });
    saveSession(session);
    setUser(session.user);
    return session;
  }

  async function forgotPassword(email) {
    setError("");
    return await post("/auth/forgot-password", { email });
  }

  async function resetPassword(token, password) {
    setError("");
    const session = await post("/auth/reset-password", { token, password });
    saveSession(session);
    setUser(session.user);
    return session;
  }

  async function loginWithGoogle(credential) {
    setError("");
    const session = await post("/auth/google", { credential });
    saveSession(session);
    setUser(session.user);
  }

  async function createProject(projectForm) {
    setError("");
    const data = await post("/projects", projectForm);
    await loadWorkspace(data.project._id);
  }

  async function addMember(memberForm) {
    if (!activeProject) {
      return;
    }

    const data = await post(`/projects/${activeProject._id}/members`, memberForm);
    setActiveProject(data.project);
    setProjects((currentProjects) => {
      return currentProjects.map((project) => (project._id === data.project._id ? data.project : project));
    });
  }

  async function createTask(taskForm) {
    if (!activeProject) {
      return;
    }

    await post(`/projects/${activeProject._id}/tasks`, {
      ...taskForm,
      dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : ""
    });
    await openProject(activeProject._id);
    await refreshDashboard();
  }

  async function changeTaskStatus(taskId, status) {
    await patch(`/projects/${activeProject._id}/tasks/${taskId}`, { status });
    await openProject(activeProject._id);
    await refreshDashboard();
  }

  async function deleteTask(taskId) {
    await remove(`/projects/${activeProject._id}/tasks/${taskId}`);
    await openProject(activeProject._id);
    await refreshDashboard();
  }

  async function sendSupportRequest(subject, message) {
    setError("");
    await post("/auth/support", { subject, message });
  }

  function logout() {
    clearSession();
    setUser(null);
    setProjects([]);
    setActiveProject(null);
    setDashboard(null);
    setTasks([]);
  }

  async function runAction(action) {
    try {
      setError("");
      return await action();
    } catch (requestError) {
      setError(requestError.message);
      return null;
    }
  }

  return {
    user,
    projects,
    activeProject,
    tasks,
    dashboard,
    error,
    loading,
    currentRole,
    canManage,
    emptyTask: createEmptyTask(activeProject),
    setError,
    runAction,
    loginWithEmail,
    verifyEmail,
    forgotPassword,
    resetPassword,
    loginWithGoogle,
    createProject,
    openProject,
    addMember,
    createTask,
    changeTaskStatus,
    deleteTask,
    sendSupportRequest,
    logout
  };
}
