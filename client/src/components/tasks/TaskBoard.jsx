import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { taskStatuses } from "../../constants/tasks.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { StatusIcon } from "./statusIcon.jsx";
import { TaskCard } from "./TaskCard.jsx";
import { TaskForm } from "./TaskForm.jsx";

export function TaskBoard({ project, tasks, canManage, onCreateTask, onChangeStatus, onDeleteTask }) {
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const text = `${task.title} ${task.description} ${task.status}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [tasks, search]);

  return (
    <Card className="board-card">
      <CardHeader className="section-heading">
        <div>
          <CardDescription>{project.name}</CardDescription>
          <CardTitle>Execution Board</CardTitle>
        </div>
        <div className="search-box">
          <Search size={16} />
          <Input placeholder="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
      </CardHeader>

      <CardContent>
        {canManage && <TaskForm project={project} onCreateTask={onCreateTask} />}

        <div className="task-columns">
          {taskStatuses.map((status) => {
            const statusTasks = filteredTasks.filter((task) => task.status === status);
            return (
              <section className="task-column" key={status}>
                <div className="column-title">
                  <StatusIcon status={status} />
                  <span>{status}</span>
                  <small>{statusTasks.length}</small>
                </div>

                <div className="task-stack">
                  {statusTasks.map((task) => (
                    <TaskCard key={task._id} task={task} canManage={canManage} onChangeStatus={onChangeStatus} onDeleteTask={onDeleteTask} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
