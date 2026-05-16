import { cn } from "../../lib/utils.js";

export function Badge({ className, variant = "default", pulse = false, ...props }) {
  return (
    <span
      className={cn("ui-badge", `ui-badge-${variant}`, pulse && "ui-badge-pulse", className)}
      data-slot="status-badge"
      data-variant={variant}
      {...props}
    />
  );
}
