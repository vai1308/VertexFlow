import { forwardRef } from "react";
import { cn } from "../../lib/utils.js";

export const Input = forwardRef(({ className, variant = "field", ...props }, ref) => {
  return <input className={cn("ui-input", `ui-input-${variant}`, className)} data-slot="field-input" data-variant={variant} ref={ref} {...props} />;
});

Input.displayName = "Input";
