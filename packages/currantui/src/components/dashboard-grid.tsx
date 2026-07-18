import * as React from "react"
import { DotsSixVerticalIcon } from "@phosphor-icons/react"

import {
  clamp,
  compact,
  moveItem,
  removeItem,
  resizeItem,
} from "@nhic/currantui/lib/grid-layout"
import { cn } from "@nhic/currantui/lib/utils"
import type { LayoutItem } from "@nhic/currantui/lib/grid-layout"

declare const process: { env: { NODE_ENV?: string } }

const isDevelopment = process.env.NODE_ENV !== "production"

interface DashboardGridHandle {
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

interface DashboardGridProps {
  layout: Array<LayoutItem>
  onLayoutChange?: (layout: Array<LayoutItem>) => void
  onHistoryChange?: (state: { canUndo: boolean; canRedo: boolean }) => void
  onWidgetRemove?: (id: string) => void
  mode?: "view" | "edit"
  columns?: number
  rowHeight?: number
  gap?: number
  collapseBreakpoint?: number
  className?: string
  children?: React.ReactNode
  ref?: React.Ref<DashboardGridHandle>
}

interface DashboardWidgetProps {
  id: string
  title: string
  toolbar?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

interface GridContextValue {
  mode: "view" | "edit"
  collapsed: boolean
  columns: number
  getItem: (id: string) => LayoutItem | undefined
  dragId: string | null
  dragRect: { left: number; top: number; width: number; height: number } | null
  startDrag: (id: string, e: React.PointerEvent<HTMLElement>) => void
  startResize: (
    id: string,
    axis: "both" | "x" | "y",
    e: React.PointerEvent<HTMLElement>
  ) => void
  keyboardId: string | null
  handleKeyDown: (
    id: string,
    title: string,
    e: React.KeyboardEvent<HTMLElement>
  ) => void
  cancelKeyboard: (id: string) => void
  removeWidget: (id: string) => void
}

const GridContext = React.createContext<GridContextValue | null>(null)

function useGridContext(component: string): GridContextValue {
  const context = React.useContext(GridContext)
  if (!context) throw new Error(`${component} must be used within a DashboardGrid`)
  return context
}

const WidgetContext = React.createContext<{ id: string; title: string } | null>(null)

function useDashboardWidget(component: string): { id: string; title: string } {
  const context = React.useContext(WidgetContext)
  if (!context) throw new Error(`${component} must be used inside a DashboardWidget`)
  return context
}

function DashboardGrid({
  layout,
  onLayoutChange,
  onHistoryChange,
  onWidgetRemove,
  mode = "view",
  columns = 12,
  rowHeight = 96,
  gap = 16,
  collapseBreakpoint = 768,
  className,
  children,
  ref,
}: DashboardGridProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [collapsed, setCollapsed] = React.useState(false)
  const [preview, setPreview] = React.useState<Array<LayoutItem> | null>(null)
  const [dragId, setDragId] = React.useState<string | null>(null)
  const [dragRect, setDragRect] = React.useState<GridContextValue["dragRect"]>(null)
  const [keyboardId, setKeyboardId] = React.useState<string | null>(null)
  const keyboardBase = React.useRef<Array<LayoutItem> | null>(null)
  const [announcement, setAnnouncement] = React.useState("")
  const lastEmitted = React.useRef<Array<LayoutItem>>(layout)
  const gestureCleanup = React.useRef<(() => void) | null>(null)
  const pendingFocusId = React.useRef<string | null>(null)
  const [history, setHistory] = React.useState<{
    stack: Array<Array<LayoutItem>>
    index: number
  }>(() => ({ stack: [layout], index: 0 }))
  const historyRef = React.useRef(history)
  historyRef.current = history

  const pushHistory = (next: Array<LayoutItem>) => {
    setHistory((current) => {
      const stack = [...current.stack.slice(0, current.index + 1), next].slice(-50)
      return { stack, index: stack.length - 1 }
    })
  }

  React.useEffect(() => () => gestureCleanup.current?.(), [])

  React.useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      setCollapsed(entry.contentRect.width < collapseBreakpoint)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [collapseBreakpoint])

  const effectiveMode = collapsed ? "view" : mode

  React.useEffect(() => {
    if (effectiveMode !== "edit") {
      setKeyboardId(null)
      setPreview(null)
    }
  }, [effectiveMode])

  const rendered = React.useMemo(
    () => (preview ?? layout).map((item) => clamp(item, columns)),
    [preview, layout, columns]
  )

  const itemsById = React.useMemo(() => {
    const map = new Map<string, LayoutItem>()
    for (const item of rendered) {
      if (map.has(item.id)) {
        if (isDevelopment) {
          console.error(
            `DashboardGrid: duplicate layout id "${item.id}"; first occurrence wins.`
          )
        }
        continue
      }
      map.set(item.id, item)
    }
    return map
  }, [rendered])

  /** Committed (non-preview) positions, used only to key DOM/tab order so a keyboard gesture never reorders the grid mid-move. */
  const committedById = React.useMemo(() => {
    const map = new Map<string, LayoutItem>()
    for (const item of layout) {
      const clamped = clamp(item, columns)
      if (map.has(clamped.id)) continue
      map.set(clamped.id, clamped)
    }
    return map
  }, [layout, columns])

  const dragPlaceholderItem = React.useMemo(() => {
    if (!dragId) return undefined
    return compact(preview ?? layout).find((item) => item.id === dragId)
  }, [dragId, preview, layout])

  const announce = (message: string) => setAnnouncement(message)

  const commitLayout = (next: Array<LayoutItem>) => {
    const settled = compact(next)
    lastEmitted.current = settled
    pushHistory(settled)
    onLayoutChange?.(settled)
  }

  React.useEffect(() => {
    if (layout !== lastEmitted.current) {
      lastEmitted.current = layout
      if (mode === "edit") pushHistory(layout)
    }
  }, [layout, mode])

  React.useEffect(() => {
    setHistory({ stack: [lastEmitted.current], index: 0 })
  }, [mode])

  React.useLayoutEffect(() => {
    const id = pendingFocusId.current
    if (!id) return
    pendingFocusId.current = null
    rootRef.current
      ?.querySelector<HTMLButtonElement>(
        `[data-slot="dashboard-widget-move"][data-widget-id="${id}"]`
      )
      ?.focus()
  }, [layout])

  const canUndo = history.index > 0
  const canRedo = history.index < history.stack.length - 1

  React.useEffect(() => {
    onHistoryChange?.({ canUndo, canRedo })
  }, [canUndo, canRedo])

  const undo = () => {
    const current = historyRef.current
    if (current.index === 0) return
    const restored = current.stack[current.index - 1]
    setHistory({ stack: current.stack, index: current.index - 1 })
    lastEmitted.current = restored
    onLayoutChange?.(restored)
    announce("Undo.")
  }

  const redo = () => {
    const current = historyRef.current
    if (current.index >= current.stack.length - 1) return
    const restored = current.stack[current.index + 1]
    setHistory({ stack: current.stack, index: current.index + 1 })
    lastEmitted.current = restored
    onLayoutChange?.(restored)
    announce("Redo.")
  }

  const removeWidget = (id: string) => {
    const next = removeItem(layout, id)
    if (next === layout) return
    lastEmitted.current = next
    pushHistory(next)
    onLayoutChange?.(next)
    onWidgetRemove?.(id)
    announce("Widget removed.")
  }

  React.useImperativeHandle(ref, () => ({ undo, redo, canUndo, canRedo }), [
    canUndo,
    canRedo,
  ])

  const startDrag = (id: string, event: React.PointerEvent<HTMLElement>) => {
    const node = rootRef.current
    const origin = layout.find((item) => item.id === id)
    if (
      effectiveMode !== "edit" ||
      event.button !== 0 ||
      !node ||
      !origin ||
      origin.static ||
      gestureCleanup.current !== null ||
      keyboardId !== null
    ) {
      return
    }
    event.preventDefault()
    const cellWidth = (node.clientWidth - gap * (columns - 1)) / columns
    const stepX = cellWidth + gap
    const stepY = rowHeight + gap
    const rect = {
      left: origin.x * stepX,
      top: origin.y * stepY,
      width: origin.w * cellWidth + (origin.w - 1) * gap,
      height: origin.h * rowHeight + (origin.h - 1) * gap,
    }
    const startX = event.clientX
    const startY = event.clientY
    const base = layout
    let current = base
    setDragId(id)
    setDragRect(rect)
    setPreview(base)

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      setDragRect({ ...rect, left: rect.left + dx, top: rect.top + dy })
      const targetX = Math.round((rect.left + dx) / stepX)
      const targetY = Math.round((rect.top + dy) / stepY)
      current = moveItem(base, id, targetX, targetY, columns)
      setPreview(current)
    }
    const finish = (commit: boolean) => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("keydown", onKeyDown, true)
      window.removeEventListener("pointercancel", onPointerCancel)
      gestureCleanup.current = null
      setDragId(null)
      setDragRect(null)
      setPreview(null)
      if (commit && current !== base) {
        commitLayout(current)
        const settled = compact(current)
        const moved = settled.find((item) => item.id === id)!
        announce(`Moved to column ${moved.x + 1}, row ${moved.y + 1}.`)
      }
    }
    const onPointerUp = () => finish(true)
    const onPointerCancel = () => finish(false)
    const onKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") {
        keyEvent.stopPropagation()
        finish(false)
      }
    }
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("keydown", onKeyDown, true)
    window.addEventListener("pointercancel", onPointerCancel)
    gestureCleanup.current = () => finish(false)
  }

  const startResize = (
    id: string,
    axis: "both" | "x" | "y",
    event: React.PointerEvent<HTMLElement>
  ) => {
    const node = rootRef.current
    const origin = layout.find((item) => item.id === id)
    if (
      effectiveMode !== "edit" ||
      event.button !== 0 ||
      !node ||
      !origin ||
      origin.static ||
      gestureCleanup.current !== null ||
      keyboardId !== null
    ) {
      return
    }
    event.preventDefault()
    const cellWidth = (node.clientWidth - gap * (columns - 1)) / columns
    const stepX = cellWidth + gap
    const stepY = rowHeight + gap
    const startX = event.clientX
    const startY = event.clientY
    const base = layout
    let current = base
    setPreview(base)

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      const w = axis === "y" ? origin.w : origin.w + Math.round(dx / stepX)
      const h = axis === "x" ? origin.h : origin.h + Math.round(dy / stepY)
      current = resizeItem(base, id, w, h, columns)
      setPreview(current)
    }
    const finish = (commit: boolean) => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("keydown", onKeyDown, true)
      window.removeEventListener("pointercancel", onPointerCancel)
      gestureCleanup.current = null
      setPreview(null)
      if (commit && current !== base) {
        commitLayout(current)
        const resized = current.find((item) => item.id === id)!
        announce(`Resized to ${resized.w} by ${resized.h} cells.`)
      }
    }
    const onPointerUp = () => finish(true)
    const onPointerCancel = () => finish(false)
    const onKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") {
        keyEvent.stopPropagation()
        finish(false)
      }
    }
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("keydown", onKeyDown, true)
    window.addEventListener("pointercancel", onPointerCancel)
    gestureCleanup.current = () => finish(false)
  }

  const arrowDeltas: Record<string, [number, number]> = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
  }

  const handleKeyDown = (
    id: string,
    title: string,
    event: React.KeyboardEvent<HTMLElement>
  ) => {
    if (effectiveMode !== "edit") return
    const grab = event.key === "Enter" || event.key === " "
    if (keyboardId !== id) {
      if (!grab || gestureCleanup.current !== null) return
      event.preventDefault()
      keyboardBase.current = layout
      setKeyboardId(id)
      setPreview(layout)
      const item = itemsById.get(id)!
      announce(
        `${title} grabbed at column ${item.x + 1}, row ${item.y + 1}. Arrow keys move, Shift plus arrows resize, Enter commits, Escape cancels.`
      )
      return
    }
    const working = preview ?? layout
    const item = working.find((candidate) => candidate.id === id)
    if (!item) return
    if (grab) {
      event.preventDefault()
      setKeyboardId(null)
      setPreview(null)
      if (working !== keyboardBase.current) {
        commitLayout(working)
        pendingFocusId.current = id
      }
      const settled = compact(working).find((candidate) => candidate.id === id)!
      announce(`${title} placed at column ${settled.x + 1}, row ${settled.y + 1}.`)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setKeyboardId(null)
      setPreview(null)
      announce(`Move cancelled. ${title} returned to column ${
        keyboardBase.current!.find((candidate) => candidate.id === id)!.x + 1
      }, row ${keyboardBase.current!.find((candidate) => candidate.id === id)!.y + 1}.`)
    } else if (event.key in arrowDeltas) {
      event.preventDefault()
      const [dx, dy] = arrowDeltas[event.key]
      const next = event.shiftKey
        ? resizeItem(working, id, item.w + dx, item.h + dy, columns)
        : moveItem(working, id, item.x + dx, item.y + dy, columns)
      setPreview(next)
      const updated = next.find((candidate) => candidate.id === id)!
      announce(
        event.shiftKey
          ? `${title} resized to ${updated.w} by ${updated.h} cells.`
          : `${title} at column ${updated.x + 1}, row ${updated.y + 1}.`
      )
    }
  }

  const onRootKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (effectiveMode !== "edit") return
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
      event.preventDefault()
      if (event.shiftKey) redo()
      else undo()
    }
  }

  const cancelKeyboard = (id: string) => {
    if (keyboardId !== id) return
    setKeyboardId(null)
    setPreview(null)
  }

  /* children render in y-then-x order so tab order and collapsed order match the visual layout */
  const widgets = React.useMemo(() => {
    const elements = React.Children.toArray(children).filter(
      (child): child is React.ReactElement<DashboardWidgetProps> =>
        React.isValidElement(child) &&
        typeof (child.props as { id?: unknown }).id === "string"
    )
    if (isDevelopment) {
      const childIds = new Set(elements.map((element) => element.props.id))
      for (const element of elements) {
        if (!itemsById.has(element.props.id)) {
          console.warn(
            `DashboardGrid: widget "${element.props.id}" has no layout item and will not render.`
          )
        }
      }
      for (const id of itemsById.keys()) {
        if (!childIds.has(id)) {
          console.warn(`DashboardGrid: layout item "${id}" has no matching widget.`)
        }
      }
    }
    return elements
      .filter((element) => itemsById.has(element.props.id))
      .sort((a, b) => {
        const itemA = committedById.get(a.props.id) ?? itemsById.get(a.props.id)!
        const itemB = committedById.get(b.props.id) ?? itemsById.get(b.props.id)!
        return itemA.y - itemB.y || itemA.x - itemB.x
      })
  }, [children, itemsById, committedById])

  const context: GridContextValue = {
    mode: effectiveMode,
    collapsed,
    columns,
    getItem: (id) => itemsById.get(id),
    dragId,
    dragRect,
    startDrag,
    startResize,
    keyboardId,
    handleKeyDown,
    cancelKeyboard,
    removeWidget,
  }

  return (
    <GridContext.Provider value={context}>
      <div
        ref={rootRef}
        data-slot="dashboard-grid"
        data-mode={effectiveMode}
        data-collapsed={collapsed || undefined}
        className={cn("relative grid w-full", className)}
        onKeyDown={onRootKeyDown}
        style={{
          gridTemplateColumns: collapsed
            ? "minmax(0, 1fr)"
            : `repeat(${columns}, minmax(0, 1fr))`,
          gridAutoRows: `${rowHeight}px`,
          gap: `${gap}px`,
        }}
      >
        {widgets}
        {dragId && dragPlaceholderItem && (
          <div
            data-slot="dashboard-grid-placeholder"
            aria-hidden="true"
            className="rounded-lg border-2 border-dashed border-foreground/25 bg-muted/60"
            style={{
              gridColumn: `${dragPlaceholderItem.x + 1} / span ${dragPlaceholderItem.w}`,
              gridRow: `${dragPlaceholderItem.y + 1} / span ${dragPlaceholderItem.h}`,
            }}
          />
        )}
        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>
      </div>
    </GridContext.Provider>
  )
}

function DashboardWidget({
  id,
  title,
  toolbar,
  className,
  children,
}: DashboardWidgetProps) {
  const context = useGridContext("DashboardWidget")
  const item = context.getItem(id)
  const widgetValue = React.useMemo(() => ({ id, title }), [id, title])
  if (!item) return null
  const editing = context.mode === "edit" && !context.collapsed && !item.static
  const dragging = context.dragId === id
  const style: React.CSSProperties = context.collapsed
    ? { gridColumn: "1 / -1", gridRow: `span ${item.h}` }
    : dragging && context.dragRect
      ? {
          position: "absolute",
          left: context.dragRect.left,
          top: context.dragRect.top,
          width: context.dragRect.width,
          height: context.dragRect.height,
          zIndex: 30,
        }
      : {
          gridColumn: `${item.x + 1} / span ${item.w}`,
          gridRow: `${item.y + 1} / span ${item.h}`,
        }
  return (
    <section
      data-slot="dashboard-widget"
      data-dragging={dragging || undefined}
      aria-label={title}
      className={cn(
        "group/widget relative flex min-w-0 flex-col overflow-hidden rounded-lg bg-card text-card-foreground ring-1 ring-foreground/10",
        (dragging || context.keyboardId === id) && "shadow-lg ring-2 ring-primary",
        className
      )}
      style={style}
    >
      <header
        data-slot="dashboard-widget-header"
        className="flex items-center gap-1 border-b border-border/50 px-3 py-2"
      >
        {editing && (
          <button
            type="button"
            data-slot="dashboard-widget-move"
            data-widget-id={id}
            aria-label={`Move ${title}`}
            className="-ms-1 shrink-0 cursor-grab touch-none rounded p-1 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
            onPointerDown={(event) => context.startDrag(id, event)}
            onKeyDown={(event) => context.handleKeyDown(id, title, event)}
            onBlur={() => context.cancelKeyboard(id)}
          >
            <DotsSixVerticalIcon aria-hidden="true" className="size-4" />
          </button>
        )}
        <span
          data-slot="dashboard-widget-title"
          className="min-w-0 flex-1 truncate font-heading text-sm font-semibold tracking-tight"
        >
          {title}
        </span>
        {editing && toolbar != null && (
          <WidgetContext.Provider value={widgetValue}>{toolbar}</WidgetContext.Provider>
        )}
      </header>
      <div
        data-slot="dashboard-widget-body"
        className="min-w-0 flex-1 overflow-auto p-3"
      >
        {children}
      </div>
      {editing && (
        <>
          <div
            data-slot="dashboard-widget-resize"
            data-axis="both"
            aria-hidden="true"
            className="absolute bottom-0 end-0 z-10 size-6 cursor-nwse-resize touch-none rounded-tl border-e-2 border-b-2 border-transparent hover:border-primary"
            onPointerDown={(event) => context.startResize(id, "both", event)}
          />
          <div
            data-slot="dashboard-widget-resize"
            data-axis="x"
            aria-hidden="true"
            className="absolute inset-y-6 end-0 z-10 w-6 cursor-ew-resize touch-none hover:bg-primary/10"
            onPointerDown={(event) => context.startResize(id, "x", event)}
          />
          <div
            data-slot="dashboard-widget-resize"
            data-axis="y"
            aria-hidden="true"
            className="absolute inset-x-6 bottom-0 z-10 h-6 cursor-ns-resize touch-none hover:bg-primary/10"
            onPointerDown={(event) => context.startResize(id, "y", event)}
          />
        </>
      )}
    </section>
  )
}

export {
  DashboardGrid,
  DashboardWidget,
  useGridContext as useDashboardGrid,
  useDashboardWidget,
}
export type { DashboardGridHandle, DashboardGridProps, DashboardWidgetProps }
