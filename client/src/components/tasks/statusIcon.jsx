import { CheckCircle2, Circle, Clock3 } from "lucide-react";

export function StatusIcon({ status, size = 16 }) {
  if (status === "Completed") {
    return <CheckCircle2 size={size} />;
  }

  if (status === "In Progress") {
    return <Clock3 size={size} />;
  }

  return <Circle size={size} />;
}
