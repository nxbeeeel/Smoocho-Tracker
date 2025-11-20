import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-[var(--blur-sm)]",
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

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

const inputVariants = cva(
  "flex w-full rounded-md border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[var(--blur-sm)] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-[var(--glass-border)] disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-[var(--glass-shadow-sm)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--glass-bg)] backdrop-blur-[var(--blur-sm)] text-foreground",
        glass: "bg-[var(--glass-bg)] backdrop-blur-[var(--blur)] text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Input = React.forwardRef(({ className, type, variant, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant, className }))}
      style={{ 
        color: '#000000',
        caretColor: '#000000'
      }}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Button, buttonVariants, Input, inputVariants }
