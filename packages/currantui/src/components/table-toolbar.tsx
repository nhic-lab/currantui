import { cn } from "@nhic/currantui/lib/utils"
import type { ReactNode } from "react"

/** Filter/search strip above a table; compose FilterChip, SearchField, Selects inside */
export function TableToolbar({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border/50 bg-background/80 px-4 py-2.5 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function TableToolbarSeparator({ className }: { className?: string }) {
  return <div className={cn("h-4 w-px bg-border/60 max-sm:hidden", className)} />
}

/** Uppercase micro-label preceding a filter group */
export function TableToolbarLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "text-[10px] font-medium tracking-wider text-muted-foreground uppercase",
        className,
      )}
    >
      {children}
    </span>
  )
}
