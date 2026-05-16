import { CalendarDays } from "lucide-react";
import { formatDate } from "../../lib/date.js";
import { Badge } from "../ui/badge.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";

export function CalendarView({ tasks }) {
  const datedTasks = tasks
    .filter((task) => task.dueDate)
    .sort((firstTask, secondTask) => new Date(firstTask.dueDate) - new Date(secondTask.dueDate));

  return (
    <Card>
      <CardHeader>
        <span className="page-kicker">Upcoming work</span>
        <CardTitle>Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {datedTasks.length === 0 ? (
          <div className="empty-state compact">No tasks with due dates yet.</div>
        ) : (
          <div className="calendar-list">
            {datedTasks.map((task) => (
              <div className="calendar-row" key={task._id}>
                <div className="calendar-icon">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.assignee?.name || "Unassigned"}</span>
                </div>
                <Badge variant={task.status === "Completed" ? "success" : "info"}>{formatDate(task.dueDate)}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
