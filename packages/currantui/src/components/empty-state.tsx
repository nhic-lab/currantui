import * as React from "react"

import { cn } from "@nhic/currantui/lib/utils"

/**
 * Centered placeholder for a view with nothing to show (no results, no
 * data yet, cleared filters). Renders no heading element — pass one via
 * `title` when the page outline needs it. For full-page failures use
 * ErrorPage; inside tables, TableEmptyState.
 */
function EmptyState({
  icon,
  title,
  description,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  /** Decorative icon, e.g. a Phosphor icon; sized and dimmed by the container */
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Actions area (buttons, links) rendered below the text */
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-1 px-6 py-10 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div
          aria-hidden="true"
          data-slot="empty-state-icon"
          className="mb-2 text-muted-foreground [&>svg]:size-10 [&>svg]:opacity-25"
        >
          {icon}
        </div>
      )}
      <div
        data-slot="empty-state-title"
        className="font-heading text-base font-semibold text-foreground"
      >
        {title}
      </div>
      {description && (
        <div
          data-slot="empty-state-description"
          className="max-w-72 text-base/relaxed text-muted-foreground"
        >
          {description}
        </div>
      )}
      {children && (
        <div
          data-slot="empty-state-actions"
          className="mt-3 flex flex-wrap items-center justify-center gap-2"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export { EmptyState }
