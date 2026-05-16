import { Bell, CalendarDays, Moon, Plus, Search, Sun } from "lucide-react";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";

export function Topbar({ title, role, theme, onToggleTheme, onNewProject }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <div className="global-search">
          <Search size={15} />
          <Input placeholder="Search projects, tasks, people..." />
        </div>
        <Button variant="outline" size="icon" aria-label="Notifications" title="Notifications">
          <Bell size={17} />
        </Button>
        <Button variant="outline" size="icon" aria-label="Calendar" title="Calendar">
          <CalendarDays size={17} />
        </Button>
        <Button variant="outline" size="icon" onClick={onToggleTheme} aria-label="Toggle theme" title="Toggle theme">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </Button>
        <Badge variant="info">{role}</Badge>
        <Button onClick={onNewProject}>
          <Plus size={15} />
          New Project
        </Button>
      </div>
    </header>
  );
}
