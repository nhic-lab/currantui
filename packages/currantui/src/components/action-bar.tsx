import * as React from "react"

import { XIcon } from "@phosphor-icons/react"
import { Button } from "@nhic/currantui/components/button"
import { cn } from "@nhic/currantui/lib/utils"

/**
 * Floating bulk-actions bar for any selectable collection (ListView,
 * CardView, TreeView, tables): renders nothing until `count` > 0, then
 * overlays the bottom of the nearest `relative` container. For a banner
 * attached above a table, TableSelectionBar remains the fit.
 */
function ActionBar({
  count,
  onClearSelection,
  clearLabel = "Clear selection",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Number of selected items; the bar renders nothing at 0 */
  count: number
  onClearSelection: () => void
  clearLabel?: string
}) {
  if (count === 0) return null

  return (
    <div
      data-slot="action-bar"
      className={cn(
        "absolute inset-x-2 bottom-2 z-10 flex items-center gap-2 rounded-lg border border-primary/30 bg-popover/90 px-3 py-1.5 shadow-lg backdrop-blur-sm duration-150 animate-in fade-in-0 slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      <span
        data-slot="action-bar-count"
        className="text-xs/relaxed font-medium text-primary tabular-nums"
      >
        {count} selected
      </span>
      {children != null && (
        <span aria-hidden="true" className="h-3.5 w-px shrink-0 bg-border" />
      )}
      <div data-slot="action-bar-actions" className="flex items-center gap-1">
        {children}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={clearLabel}
        onClick={onClearSelection}
        className="ms-auto"
      >
        <XIcon />
      </Button>
    </div>
  )
}

export { ActionBar }
