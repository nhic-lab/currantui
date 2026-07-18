import * as React from "react"
import { XIcon } from "@phosphor-icons/react"

import {
  useDashboardGrid,
  useDashboardWidget,
} from "@nhic/currantui/components/dashboard-grid"
import { cn } from "@nhic/currantui/lib/utils"

/**
 * Header slot for DashboardWidget in edit mode: app-supplied actions plus a
 * built-in remove button wired through the grid context. Fades in on
 * hover/focus so view density stays high.
 */
function WidgetToolbar({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const grid = useDashboardGrid("WidgetToolbar")
  const widget = useDashboardWidget("WidgetToolbar")
  return (
    <div
      data-slot="widget-toolbar"
      className={cn(
        "flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/widget:opacity-100 group-focus-within/widget:opacity-100",
        className
      )}
    >
      {children}
      <button
        type="button"
        aria-label={`Remove ${widget.title}`}
        className="rounded p-1 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => grid.removeWidget(widget.id)}
      >
        <XIcon aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}

interface WidgetPaletteItem {
  type: string
  label: string
  description?: string
  icon?: React.ReactNode
}

function WidgetPaletteButton({
  item,
  onWidgetAdd,
}: {
  item: WidgetPaletteItem
  onWidgetAdd: (type: string) => void
}) {
  const baseId = React.useId()
  const labelId = `${baseId}-label`
  const descriptionId = `${baseId}-description`
  return (
    <div role="listitem">
      <button
        type="button"
        className="flex w-full items-start gap-2 rounded-md p-2 text-start outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        aria-labelledby={labelId}
        aria-describedby={item.description ? descriptionId : undefined}
        onClick={() => onWidgetAdd(item.type)}
      >
        {item.icon && (
          <span aria-hidden="true" className="mt-0.5 shrink-0 text-muted-foreground">
            {item.icon}
          </span>
        )}
        <span className="flex min-w-0 flex-col">
          <span id={labelId} className="text-sm font-medium">
            {item.label}
          </span>
          {item.description && (
            <span id={descriptionId} className="text-xs text-muted-foreground">
              {item.description}
            </span>
          )}
        </span>
      </button>
    </div>
  )
}

function WidgetPalette({
  items,
  onWidgetAdd,
  className,
  ...props
}: {
  items: Array<WidgetPaletteItem>
  onWidgetAdd: (type: string) => void
  className?: string
} & Omit<React.ComponentProps<"div">, "children">) {
  return (
    <div
      data-slot="widget-palette"
      role="list"
      className={cn(
        "flex w-64 flex-col gap-1 rounded-lg bg-card p-2 ring-1 ring-foreground/10",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <WidgetPaletteButton key={item.type} item={item} onWidgetAdd={onWidgetAdd} />
      ))}
    </div>
  )
}

export { WidgetPalette, WidgetToolbar }
export type { WidgetPaletteItem }
