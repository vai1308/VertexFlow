import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { formatDate } from "../../lib/date.js";
import { Avatar } from "../ui/avatar.jsx";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Textarea } from "../ui/textarea.jsx";

export function ProjectsView({ projects, activeProjectId, onCreateProject, onOpenProject }) {
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter((project) => {
    return `${project.name} ${project.description}`.toLowerCase().includes(search.toLowerCase());
  });

  async function submitProject(event) {
    event.preventDefault();
    await onCreateProject(projectForm);
    setProjectForm({ name: "", description: "" });
  }

  return (
    <div className="projects-layout">
      <Card>
        <CardHeader className="inline-card-header">
          <div>
            <span className="page-kicker">Project directory</span>
            <CardTitle>All Projects</CardTitle>
          </div>
          <div className="search-box">
            <Search size={16} />
            <Input placeholder="Search projects..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Description</th>
                  <th>Members</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project._id} className={activeProjectId === project._id ? "selected" : ""} onClick={() => onOpenProject(project._id)}>
                    <td><strong>{project.name}</strong></td>
                    <td>{project.description || "No description"}</td>
                    <td>
                      <div className="avatar-group">
                        {project.members.slice(0, 4).map((member) => (
                          <Avatar key={member._id} name={member.user?.name || member.name || member.email} />
                        ))}
                      </div>
                    </td>
                    <td><Badge variant="success">Active</Badge></td>
                    <td>{formatDate(project.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <span className="page-kicker">Start something new</span>
          <CardTitle>Create Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="project-form" onSubmit={submitProject}>
            <Input placeholder="Project name" value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} required />
            <Textarea placeholder="Short description" value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} />
            <Button type="submit">
              <Plus size={16} />
              Create Project
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
