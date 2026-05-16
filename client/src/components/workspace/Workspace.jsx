import { useState } from "react";
import { Alert } from "../ui/alert.jsx";
import { Card } from "../ui/card.jsx";
import { CalendarView } from "../calendar/CalendarView.jsx";
import { DashboardView } from "../dashboard/DashboardView.jsx";
import { Sidebar } from "../layout/Sidebar.jsx";
import { Topbar } from "../layout/Topbar.jsx";
import { MembersView } from "../members/MembersView.jsx";
import { ProjectsView } from "../projects/ProjectsView.jsx";
import { SettingsView } from "../settings/SettingsView.jsx";
import { TaskBoard } from "../tasks/TaskBoard.jsx";
import { SupportModal } from "../support/SupportView.jsx";

export function Workspace({ workspace, theme, onToggleTheme }) {
  const [activeView, setActiveView] = useState("dashboard");
  const [supportOpen, setSupportOpen] = useState(false);
  const titles = {
    dashboard: "Workspace Overview",
    projects: "Projects",
    tasks: workspace.activeProject?.name || "Task Board",
    calendar: "Schedule",
    members: "Team",
    settings: "Settings"
  };

  function openProjectsView() {
    setActiveView("projects");
  }

  async function handleSupportSubmit(subject, message) {
    return await workspace.runAction(() => workspace.sendSupportRequest(subject, message));
  }

  function openSupport() {
    setSupportOpen(true);
  }

  function closeSupport() {
    setSupportOpen(false);
  }

  function handleNavChange(view) {
    closeSupport();
    setActiveView(view);
  }

  return (
    <main className="app-shell">
      <Sidebar
        user={workspace.user}
        activeView={activeView}
        onChangeView={handleNavChange}
        onLogout={workspace.logout}
        onSupport={openSupport}
      />

      <section className="content">
        <Topbar title={titles[activeView]} role={workspace.currentRole} theme={theme} onToggleTheme={onToggleTheme} onNewProject={openProjectsView} />

        {workspace.loading ? (
          <Card className="empty-state">Loading workspace...</Card>
        ) : (
          <>
            {workspace.error && <Alert variant="destructive">{workspace.error}</Alert>}

            {activeView === "dashboard" && <DashboardView dashboard={workspace.dashboard} projects={workspace.projects} />}

            {activeView === "projects" && (
              <ProjectsView
                projects={workspace.projects}
                activeProjectId={workspace.activeProject?._id}
                onCreateProject={(projectForm) => workspace.runAction(() => workspace.createProject(projectForm))}
                onOpenProject={(projectId) =>
                  workspace.runAction(async () => {
                    await workspace.openProject(projectId);
                    handleNavChange("tasks");
                  })
                }
              />
            )}

            {activeView === "tasks" && !workspace.activeProject ? (
              <Card className="empty-state">Create a project to start assigning tasks.</Card>
            ) : null}

            {activeView === "tasks" && workspace.activeProject && (
              <TaskBoard
                project={workspace.activeProject}
                tasks={workspace.tasks}
                canManage={workspace.canManage}
                onCreateTask={(taskForm) => workspace.runAction(() => workspace.createTask(taskForm))}
                onChangeStatus={(taskId, status) => workspace.runAction(() => workspace.changeTaskStatus(taskId, status))}
                onDeleteTask={(taskId) => workspace.runAction(() => workspace.deleteTask(taskId))}
              />
            )}

            {activeView === "calendar" && <CalendarView tasks={workspace.tasks} />}

            {activeView === "members" && workspace.activeProject && (
              <MembersView
                project={workspace.activeProject}
                canManage={workspace.canManage}
                onAddMember={(memberForm) => workspace.runAction(() => workspace.addMember(memberForm))}
              />
            )}

            {activeView === "members" && !workspace.activeProject && <Card className="empty-state">Create a project to manage members.</Card>}

            {activeView === "settings" && <SettingsView user={workspace.user} role={workspace.currentRole} />}

            {supportOpen && (
              <SupportModal
                onSubmit={handleSupportSubmit}
                onCancel={closeSupport}
                error={workspace.error}
              />
            )}
          </>
        )}
      </section>
    </main>
  );
}
