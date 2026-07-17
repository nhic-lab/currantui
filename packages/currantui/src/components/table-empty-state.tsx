import { cn } from "@nhic/currantui/lib/utils"
import type { ReactNode } from "react"

interface TableEmptyStateProps {
  /** Decorative icon, e.g. a Phosphor icon; sized and dimmed by the container */
  icon?: ReactNode
  /** The message, and optionally a call to action */
  children: ReactNode
  className?: string
}

export function TableEmptyState({ icon, children, className }: TableEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground [&>svg]:size-10 [&>svg]:opacity-20",
        className,
      )}
    >
      {icon}
      <p className="text-sm">{children}</p>
    </div>
  )
}
