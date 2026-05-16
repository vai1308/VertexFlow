import { Trash2 } from "lucide-react";
import { taskStatuses } from "../../constants/tasks.js";
import { formatDate } from "../../lib/date.js";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";
import { Card } from "../ui/card.jsx";
import { Select } from "../ui/select.jsx";

export function TaskCard({ task, canManage, onChangeStatus, onDeleteTask }) {
  return (
    <Card className="task-card">
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <Badge variant={task.status === "Completed" ? "success" : task.status === "In Progress" ? "info" : "secondary"}>{task.status}</Badge>
      </div>

      <p>{task.description || "No description"}</p>

      <div className="task-meta">
        <span>Owner: {task.assignee?.name || "Unassigned"}</span>
        <span>Due: {formatDate(task.dueDate)}</span>
      </div>

      <div className="task-actions">
        <Select value={task.status} onChange={(event) => onChangeStatus(task._id, event.target.value)}>
          {taskStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </Select>
        {canManage && (
          <Button variant="destructive" size="icon" onClick={() => onDeleteTask(task._id)} aria-label="Delete task" title="Delete task">
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </Card>
  );
}
