import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[var(--glass-border)] bg-background/60 backdrop-blur-[var(--blur-sm)] px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
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

export { Input }
