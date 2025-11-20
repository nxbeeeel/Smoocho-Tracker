import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext({
  value: '',
  onValueChange: () => {},
})

const Tabs = React.forwardRef(({ className, value, onValueChange, children, ...props }, ref) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-lg bg-muted/60 backdrop-blur-[var(--blur-sm)] p-1 border border-[var(--glass-border)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value: tabValue, children, ...props }, ref) => {
  const { value, onValueChange } = React.useContext(TabsContext)
  const isActive = value === tabValue
  
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onValueChange?.(tabValue)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-base font-semibold transition-all outline-none disabled:pointer-events-none disabled:opacity-50 flex-1 backdrop-blur-[var(--blur-sm)]",
        isActive 
          ? "bg-background/80 text-foreground border border-[var(--glass-border)]" 
          : "text-muted-foreground hover:text-foreground hover:bg-background/40",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value: tabValue, children, ...props }, ref) => {
  const { value } = React.useContext(TabsContext)
  
  if (value !== tabValue) return null
  
  return (
    <div
      ref={ref}
      className={cn("mt-4 ring-offset-background focus-visible:outline-none", className)}
      {...props}
    >
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
