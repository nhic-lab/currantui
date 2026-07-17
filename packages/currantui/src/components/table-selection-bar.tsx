import { XIcon } from "@phosphor-icons/react"

import { cn } from "@nhic/currantui/lib/utils"
import type { ReactNode } from "react"

/**
 * A focused row control (e.g. a selection checkbox) keeps focus when a Radix
 * Select in the bar opens; Radix then aria-hides the page, leaving focus
 * trapped in the hidden subtree (an a11y violation). Attach this to the
 * trigger's onPointerDown so focus moves cleanly into the listbox. Pointer
 * only — keyboard open (focus already on the trigger) is untouched.
 */
export function blurFocusedRowControl(): void {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
}

interface TableSelectionBarProps {
  /** Number of selected rows; the bar renders nothing at 0 */
  count: number
  onClear: () => void
  clearLabel?: string
  /** Bulk actions, rendered after the count */
  children?: ReactNode
  className?: string
}

export function TableSelectionBar({
  count,
  onClear,
  clearLabel = "Clear",
  children,
  className,
}: TableSelectionBarProps) {
  if (count === 0) return null

  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b border-primary/30 bg-primary/5 px-4 py-1.5",
        className,
      )}
    >
      <span className="text-xs font-medium text-primary">{count} selected</span>
      {children != null && <div className="ml-1 h-3 w-px bg-border/60" />}
      {children}
      <button
        type="button"
        onClick={onClear}
        className="ml-auto flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-foreground/70 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
      >
        <XIcon size={14} />
        {clearLabel}
      </button>
    </div>
  )
}
