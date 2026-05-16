import { FolderKanban } from "lucide-react";
import { formatDate } from "../../lib/date.js";
import { Badge } from "../ui/badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card.jsx";
import { MetricsGrid } from "./MetricsGrid.jsx";

export function DashboardView({ dashboard, projects }) {
  const summary = dashboard?.summary || {};
  const hasTasks = Boolean(summary.tasks);
  const totalTasks = Math.max(summary.tasks || 1, 1);
  const pending = Math.round(((summary.pending || 0) / totalTasks) * 100);
  const inProgress = Math.round(((summary.inProgress || 0) / totalTasks) * 100);
  const completed = Math.round(((summary.completed || 0) / totalTasks) * 100);
  const overdue = Math.round(((summary.overdue || 0) / totalTasks) * 100);
  const workloadItems = [
    { label: "To Do", value: summary.pending || 0, percent: pending, tone: "amber" },
    { label: "In Progress", value: summary.inProgress || 0, percent: inProgress, tone: "sky" },
    { label: "Completed", value: summary.completed || 0, percent: completed, tone: "emerald" },
    { label: "Overdue", value: summary.overdue || 0, percent: overdue, tone: "rose" }
  ];

  return (
    <>
      <section className="dashboard-hero">
        <div>
          <span className="page-kicker">Today</span>
          <h2>Track progress, deadlines, and team workload from one calm dashboard.</h2>
        </div>
        <div className="hero-stat-strip">
          <div>
            <span>Tasks</span>
            <strong>{summary.tasks || 0}</strong>
          </div>
          <div>
            <span>Overdue</span>
            <strong>{summary.overdue || 0}</strong>
          </div>
          <div>
            <span>Projects</span>
            <strong>{summary.projects || projects.length || 0}</strong>
          </div>
        </div>
      </section>

      <MetricsGrid summary={summary} />

      <section className="dashboard-grid">
        <Card>
          <CardHeader>
            <CardDescription>Status distribution</CardDescription>
            <CardTitle>Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="workload-panel">
              <div className="workload-score">
                <span>Total work</span>
                <strong>{summary.tasks || 0}</strong>
                <small>{hasTasks ? `${completed}% completed` : "No tasks yet"}</small>
              </div>
              <div className="workload-bars">
                {workloadItems.map((item) => (
                  <WorkloadBar key={item.label} {...item} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="inline-card-header">
            <div>
              <CardDescription>Needs attention</CardDescription>
              <CardTitle>Overdue Tasks</CardTitle>
            </div>
            <button className="text-link" type="button">View all</button>
          </CardHeader>
          <CardContent>
            <div className="overdue-list">
              {(dashboard?.overdueTasks || []).length === 0 ? (
                <p className="muted-text">No overdue tasks.</p>
              ) : (
                dashboard.overdueTasks.map((task) => (
                  <div className="dashboard-task-row" key={task._id}>
                    <div>
                      <strong>{task.title}</strong>
                      <span>{task.project?.name || "Project"}</span>
                    </div>
                    <Badge variant="danger">{formatDate(task.dueDate)}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="inline-card-header">
          <div>
            <CardDescription>Recently updated</CardDescription>
            <CardTitle>Active Projects</CardTitle>
          </div>
          <button className="text-link" type="button">View all</button>
        </CardHeader>
        <CardContent>
          <div className="recent-projects">
            {projects.slice(0, 3).map((project) => (
              <div className="recent-project-card" key={project._id}>
                <div className="project-icon">
                  <FolderKanban size={18} />
                </div>
                <div>
                  <strong>{project.name}</strong>
                  <span>Updated {formatDate(project.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function WorkloadBar({ label, value, percent, tone }) {
  return (
    <div className={`workload-bar tone-${tone}`}>
      <div className="workload-bar-meta">
        <span>{label}</span>
        <strong>{value} ({percent}%)</strong>
      </div>
      <div className="workload-track" aria-label={`${label}: ${percent}%`}>
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
