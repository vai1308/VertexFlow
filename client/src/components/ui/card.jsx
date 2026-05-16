import { cn } from "../../lib/utils.js";

export function Card({ className, variant = "panel", ...props }) {
  return <section className={cn("ui-card", `ui-card-${variant}`, className)} data-slot="surface-card" data-variant={variant} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <header className={cn("ui-card-header", className)} data-slot="surface-card-header" {...props} />;
}

export function CardTitle({ className, as: Component = "h3", ...props }) {
  return <Component className={cn("ui-card-title", className)} data-slot="surface-card-title" {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("ui-card-description", className)} data-slot="surface-card-description" {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("ui-card-content", className)} data-slot="surface-card-content" {...props} />;
}
