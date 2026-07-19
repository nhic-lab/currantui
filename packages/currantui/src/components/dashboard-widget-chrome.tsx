import * as React from "react"
import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  Button,
  useDragAndDrop,
} from "react-aria-components"
import { DotsSixVerticalIcon, XIcon } from "@phosphor-icons/react"

import { endWidgetDrag, startWidgetDrag } from "@nhic/currantui/lib/widget-drag"
import {
  useDashboardGrid,
  useDashboardWidget,
} from "@nhic/currantui/components/dashboard-grid"
import { cn } from "@nhic/currantui/lib/utils"

const WIDGET_DRAG_TYPE = "application/x-nhic-widget"

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

function WidgetPaletteRow({ item }: { item: WidgetPaletteItem }) {
  const baseId = React.useId()
  const labelId = `${baseId}-label`
  const descriptionId = `${baseId}-description`
  return (
    <AriaGridListItem
      id={item.type}
      textValue={item.label}
      aria-labelledby={labelId}
      aria-describedby={item.description ? descriptionId : undefined}
      className="flex w-full cursor-grab items-start gap-2 rounded-md p-2 text-start outline-none hover:bg-muted data-[dragging]:opacity-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring"
    >
      <Button slot="drag" className="mt-0.5 shrink-0 outline-none">
        <DotsSixVerticalIcon size={12} aria-hidden />
      </Button>
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
    </AriaGridListItem>
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
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({
        [WIDGET_DRAG_TYPE]: JSON.stringify({ type: key as string }),
      })),
    onDragStart(event) {
      const [key] = [...event.keys]
      startWidgetDrag(key as string)
    },
    onDragEnd() {
      endWidgetDrag()
    },
  })

  return (
    <AriaGridList
      data-slot="widget-palette"
      items={items}
      dragAndDropHooks={dragAndDropHooks}
      onAction={(key) => onWidgetAdd(key as string)}
      className={cn(
        "flex w-64 flex-col gap-1 rounded-lg bg-card p-2 ring-1 ring-foreground/10 outline-none",
        className
      )}
      {...props}
    >
      {(item) => <WidgetPaletteRow item={item} />}
    </AriaGridList>
  )
}

export { WidgetPalette, WidgetToolbar }
export type { WidgetPaletteItem }
