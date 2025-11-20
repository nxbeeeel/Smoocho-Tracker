import * as React from "react"
import { cn } from "@/lib/utils"

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-background/80 backdrop-blur-[var(--blur)] text-foreground border-[var(--glass-border)] shadow-[var(--glass-shadow)]",
    destructive: "border-destructive/50 text-destructive bg-destructive/10 backdrop-blur-[var(--blur)] shadow-[var(--glass-shadow)]",
    success: "border-green-500/30 text-green-300 bg-green-500/10 backdrop-blur-[var(--blur)] shadow-[var(--glass-shadow)]",
    warning: "border-yellow-500/30 text-yellow-300 bg-yellow-500/10 backdrop-blur-[var(--blur)] shadow-[var(--glass-shadow)]",
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
