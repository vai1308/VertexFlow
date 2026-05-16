import { forwardRef } from "react";
import { cn } from "../../lib/utils.js";

export const Textarea = forwardRef(({ className, variant = "field", ...props }, ref) => {
  return <textarea className={cn("ui-textarea", `ui-textarea-${variant}`, className)} data-slot="field-textarea" data-variant={variant} ref={ref} {...props} />;
});

Textarea.displayName = "Textarea";
