import { cn } from "@nhic/currantui/lib/utils"
import type { ReactNode } from "react"

interface TableFooterCountProps {
  /** Rows currently shown (after filtering) */
  shown: number
  /** Total rows before filtering */
  total: number
  /** Selected-row count; the " · N selected" suffix renders only when > 0 */
  selected?: number
  /** Noun for the rows, e.g. "studies" */
  label?: string
  /** Replaces the default text entirely when provided */
  children?: ReactNode
  className?: string
}

export function TableFooterCount({
  shown,
  total,
  selected = 0,
  label = "rows",
  children,
  className,
}: TableFooterCountProps) {
  return (
    <div
      className={cn(
        "border-t border-border/50 px-4 py-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      {children ?? (
        <>
          {shown} of {total} {label}
          {selected > 0 && ` · ${selected} selected`}
        </>
      )}
    </div>
  )
}
