import * as React from "react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-12 w-full rounded-md border border-[var(--glass-border)] bg-background/60 backdrop-blur-[var(--blur-sm)] px-4 py-3 text-base outline-none focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      style={{ 
        color: '#000000',
      }}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = "Select"

export { Select }
