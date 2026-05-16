import { CheckCircle2, Circle, Clock3, FolderKanban } from "lucide-react";
import { Card } from "../ui/card.jsx";

const metrics = [
  { key: "projects", label: "Projects", icon: FolderKanban, tone: "teal" },
  { key: "pending", label: "To Do", icon: Circle, tone: "orange" },
  { key: "inProgress", label: "Active", icon: Clock3, tone: "blue" },
  { key: "completed", label: "Done", icon: CheckCircle2, tone: "green" }
];

export function MetricsGrid({ summary }) {
  return (
    <section className="metrics-grid">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card className={`metric-card tone-${metric.tone}`} key={metric.key}>
            <div className="metric-icon">
              <Icon size={18} />
            </div>
            <span>{metric.label}</span>
            <strong>{summary?.[metric.key] || 0}</strong>
          </Card>
        );
      })}
    </section>
  );
}
