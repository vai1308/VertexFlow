import { cn } from "../../lib/utils.js";

export function Avatar({ name, className, size = "default" }) {
  const initials = (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.slice(0, 1).toUpperCase())
    .join("");

  return (
    <div className={cn("ui-avatar", `ui-avatar-${size}`, className)} data-slot="operator-avatar" data-size={size} title={name || "Unknown operator"}>
      {initials || "?"}
    </div>
  );
}
