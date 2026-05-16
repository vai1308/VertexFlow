import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const buttonVariants = cva("ui-button", {
  variants: {
    variant: {
      default: "ui-button-command",
      command: "ui-button-command",
      secondary: "ui-button-secondary",
      ghost: "ui-button-ghost",
      destructive: "ui-button-destructive",
      outline: "ui-button-outline",
      utility: "ui-button-utility"
    },
    size: {
      default: "ui-button-md",
      sm: "ui-button-sm",
      icon: "ui-button-icon",
      compact: "ui-button-compact"
    }
  },
  defaultVariants: {
    variant: "command",
    size: "default"
  }
});

export const Button = forwardRef(({ className, variant = "command", size, asChild = false, type, ...props }, ref) => {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(buttonVariants({ variant, size }), className)}
      data-slot="control-button"
      data-size={size || "default"}
      data-variant={variant}
      ref={ref}
      type={asChild ? undefined : type || "button"}
      {...props}
    />
  );
});

Button.displayName = "Button";
