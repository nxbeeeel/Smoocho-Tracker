import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, variant, glass, ...props }, ref) => {
  // Custom glass properties override defaults
  const glassStyle = glass ? {
    background: glass.color || `var(--glass-bg)`,
    backdropFilter: `blur(${glass.blur || 'var(--blur)'}px)`,
    opacity: glass.transparency !== undefined ? glass.transparency : 1,
    borderColor: glass.outline || `var(--glass-border)`,
  } : {};
  
  const baseClasses = variant === 'glass' && glass
    ? "border backdrop-blur-md"
    : "border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[var(--blur)]";
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg text-card-foreground",
        baseClasses,
        className
      )}
      style={glass ? glassStyle : undefined}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
