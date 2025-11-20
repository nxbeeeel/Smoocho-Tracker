import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border border-white/30 bg-white/95 text-base text-slate-900 shadow-[var(--glass-shadow-sm)] px-4 py-3 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 outline-none focus:border-primary/70 focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-60 transition-all",
        className
      )}
      style={{ 
        color: '#0f172a',
        caretColor: '#0f172a'
      }}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
