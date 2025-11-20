import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 backdrop-blur-[var(--blur-sm)]",
  {
    variants: {
      variant: {
        default: "bg-primary/90 text-primary-foreground hover:bg-primary shadow-[var(--glass-shadow)] border border-[var(--glass-border)]",
        destructive:
          "bg-destructive/90 text-destructive-foreground hover:bg-destructive shadow-[var(--glass-shadow)] border border-destructive/30",
        outline:
          "border border-[var(--glass-border)] bg-background/60 hover:bg-background/80 hover:text-accent-foreground shadow-[var(--glass-shadow-sm)]",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary/90 shadow-[var(--glass-shadow)] border border-[var(--glass-border)]",
        ghost: "bg-transparent hover:bg-accent/50 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button"
    return (
      <Component
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
