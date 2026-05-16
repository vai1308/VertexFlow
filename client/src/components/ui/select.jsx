import { forwardRef } from "react";
import { cn } from "../../lib/utils.js";

export const Select = forwardRef(({ className, children, variant = "field", ...props }, ref) => {
  return (
    <select className={cn("ui-select", `ui-select-${variant}`, className)} data-slot="field-select" data-variant={variant} ref={ref} {...props}>
      {children}
    </select>
  );
});

Select.displayName = "Select";
