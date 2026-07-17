import { cva } from "class-variance-authority"

import { cn } from "@nhic/currantui/lib/utils"
import type { ReactNode } from "react"

/*
 * Exported so chip-shaped triggers (e.g. a SelectTrigger acting as an
 * "Earlier…" year picker) can borrow the exact same look.
 */
export const filterChipVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none",
  {
    variants: {
      active: {
        true: "border-primary bg-primary/10 text-primary-deep dark:text-primary",
        false:
          "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)

interface FilterChipProps {
  active: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}

export function FilterChip({ active, onClick, children, className }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(filterChipVariants({ active }), className)}
    >
      {children}
    </button>
  )
}
