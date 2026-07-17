import { cn } from "@nhic/currantui/lib/utils"
import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  subtitle?: ReactNode
  right?: ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, right, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex shrink-0 items-baseline justify-between border-b border-border/50 py-3",
        className,
      )}
    >
      <div className="flex items-baseline gap-2">
        <h1 className="font-heading text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle != null ? (
          <span className="text-xs text-muted-foreground tabular-nums">{subtitle}</span>
        ) : null}
      </div>
      {right != null ? right : null}
    </header>
  )
}
