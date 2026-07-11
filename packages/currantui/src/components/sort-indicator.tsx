import { ArrowDownIcon, ArrowUpIcon, ArrowsDownUpIcon } from "@phosphor-icons/react"

import { cn } from "@nhic/currantui/lib/utils"

interface SortIndicatorProps {
  /** Matches TanStack Table's `column.getIsSorted()` return shape */
  direction: false | "asc" | "desc"
  className?: string
}

export function SortIndicator({ direction, className }: SortIndicatorProps) {
  if (direction === "asc")
    return <ArrowUpIcon size={10} className={cn("text-primary", className)} />
  if (direction === "desc")
    return <ArrowDownIcon size={10} className={cn("text-primary", className)} />
  return <ArrowsDownUpIcon size={10} className={cn("opacity-30", className)} />
}
