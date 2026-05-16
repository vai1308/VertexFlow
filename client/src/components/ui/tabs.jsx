import { cn } from "../../lib/utils.js";

export function Tabs({ className, ...props }) {
  return <div className={cn("ui-tabs", className)} data-slot="segmented-control" role="tablist" {...props} />;
}

export function TabsTrigger({ active, className, ...props }) {
  return (
    <button
      aria-selected={Boolean(active)}
      className={cn("ui-tabs-trigger", active && "is-active", className)}
      data-slot="segmented-control-trigger"
      role="tab"
      type="button"
      {...props}
    />
  );
}
