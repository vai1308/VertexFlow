import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { createEmptyTask } from "../../constants/tasks.js";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";
import { Select } from "../ui/select.jsx";
import { Textarea } from "../ui/textarea.jsx";

export function TaskForm({ project, onCreateTask }) {
  const [taskForm, setTaskForm] = useState(createEmptyTask(project));

  useEffect(() => {
    setTaskForm(createEmptyTask(project));
  }, [project?._id]);

  async function submitTask(event) {
    event.preventDefault();
    await onCreateTask(taskForm);
    setTaskForm(createEmptyTask(project));
  }

  return (
    <form className="task-form" onSubmit={submitTask}>
      <div className="task-form-title">
        <span className="page-kicker">New work item</span>
        <Input placeholder="Name the task" value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} required />
      </div>

      <Label className="field-block">
        Owner
        <Select value={taskForm.assignee} onChange={(event) => setTaskForm({ ...taskForm, assignee: event.target.value })}>
          <option value="">Unassigned</option>
          {project.members
            .filter((member) => member.user?._id)
            .map((member) => (
              <option key={member._id} value={member.user._id}>
                {member.user.name} ({member.user.email})
              </option>
            ))}
        </Select>
      </Label>

      <Label className="field-block">
        Target date
        <Input type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })} />
      </Label>

      <Textarea placeholder="Add decision notes, acceptance details, or blockers" value={taskForm.description} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} />

      <Button type="submit">
        <Plus size={16} />
        Place on board
      </Button>
    </form>
  );
}

