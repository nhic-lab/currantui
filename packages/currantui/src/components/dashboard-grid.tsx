import * as React from "react"
import { DropZone } from "react-aria-components"
import { DotsSixVerticalIcon } from "@phosphor-icons/react"

import {
  getActiveWidgetDrag,
  subscribeWidgetDrag,
} from "@nhic/currantui/lib/widget-drag"
import {
  clamp,
  compact,
  layoutsEqual,
  moveItem,
  removeItem,
  resizeItem,
  resizeRect,
} from "@nhic/currantui/lib/grid-layout"
import { cn } from "@nhic/currantui/lib/utils"
import type { DropZoneProps, TextDropItem } from "react-aria-components"
import type {
  Compaction,
  LayoutItem,
  ResizeHandle,
} from "@nhic/currantui/lib/grid-layout"

type DropEvent = Parameters<NonNullable<DropZoneProps["onDrop"]>>[0]
type DropMoveEvent = Parameters<NonNullable<DropZoneProps["onDropMove"]>>[0]

declare const process: { env: { NODE_ENV?: string } }

const isDevelopment = process.env.NODE_ENV !== "production"

const WIDGET_DRAG_TYPE = "application/x-nhic-widget"

/* The pre-0.10 axis vocabulary, kept so an existing `startResize` caller keeps
   working: those three values named the only three handles that existed. */
const LEGACY_RESIZE_HANDLES: Record<string, ResizeHandle> = {
  both: "se",
  x: "e",
  y: "s",
}

/* All eight handles, each a >=24px hit area. Corners sit above the edges so a
   corner drag wins in the overlap, and the header insets its own controls past
   the top corners (see the `movable` header padding) so `nw`/`ne` stay
   reachable. Hidden until the widget is hovered or focused: handles that only
   appeared under the cursor read as a single handle, which is a discoverability
   defect in its own right. */
const RESIZE_HANDLES: Array<{
  handle: ResizeHandle
  /** the pre-0.10 `data-axis` value, kept on the three handles that had one */
  axis?: "both" | "x" | "y"
  className: string
}> = [
  {
    handle: "n",
    className:
      "inset-x-6 top-0 h-6 cursor-ns-resize border-t-2 border-transparent hover:border-primary",
  },
  {
    handle: "s",
    axis: "y",
    className:
      "inset-x-6 bottom-0 h-6 cursor-ns-resize border-b-2 border-transparent hover:border-primary",
  },
  {
    handle: "w",
    className:
      "inset-y-6 start-0 w-6 cursor-ew-resize border-s-2 border-transparent hover:border-primary",
  },
  {
    handle: "e",
    axis: "x",
    className:
      "inset-y-6 end-0 w-6 cursor-ew-resize border-e-2 border-transparent hover:border-primary",
  },
  {
    handle: "nw",
    className:
      "top-0 start-0 z-30 size-6 cursor-nwse-resize rounded-br border-s-2 border-t-2 border-foreground/25 hover:border-primary",
  },
  {
    handle: "ne",
    className:
      "top-0 end-0 z-30 size-6 cursor-nesw-resize rounded-bl border-t-2 border-e-2 border-foreground/25 hover:border-primary",
  },
  {
    handle: "sw",
    className:
      "bottom-0 start-0 z-30 size-6 cursor-nesw-resize rounded-tr border-s-2 border-b-2 border-foreground/25 hover:border-primary",
  },
  {
    handle: "se",
    axis: "both",
    className:
      "bottom-0 end-0 z-30 size-6 cursor-nwse-resize rounded-tl border-e-2 border-b-2 border-foreground/25 hover:border-primary",
  },
]

/** Column/row pixel sizing at the grid's current width, used to convert a pointer offset to a cell. */
function gridSteps(
  node: HTMLElement,
  columns: number,
  rowHeight: number,
  gap: number
): { cellWidth: number; stepX: number; stepY: number } {
  const cellWidth = (node.clientWidth - gap * (columns - 1)) / columns
  return { cellWidth, stepX: cellWidth + gap, stepY: rowHeight + gap }
}

/** Pixel offset (relative to the grid root) to a clamped grid cell. */
function pointToCell(
  x: number,
  y: number,
  steps: { stepX: number; stepY: number },
  columns: number
): { x: number; y: number } {
  return {
    x: Math.min(Math.max(Math.round(x / steps.stepX), 0), columns - 1),
    y: Math.max(Math.round(y / steps.stepY), 0),
  }
}

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
  onWidgetDrop?: (type: string, cell: { x: number; y: number }) => void
  mode?: "view" | "edit"
  /** Gesture settling. Defaults to `vertical` — the historical gravity. */
  compaction?: Compaction
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
    handle: ResizeHandle | "both" | "x" | "y",
    e: React.PointerEvent<HTMLElement>
  ) => void
  keyboardId: string | null
  handleKeyDown: (
    id: string,
    title: string,
    e: React.KeyboardEvent<HTMLElement>
  ) => void
  cancelKeyboard: (id: string, title: string) => void
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
  onWidgetDrop,
  mode = "view",
  compaction = "vertical",
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
  const activeWidgetDrag = React.useSyncExternalStore(
    subscribeWidgetDrag,
    getActiveWidgetDrag,
    getActiveWidgetDrag
  )
  const [dropHoverCell, setDropHoverCell] = React.useState<{
    x: number
    y: number
  } | null>(null)
  const dropStepsRef = React.useRef<ReturnType<typeof gridSteps> | null>(null)
  const [dragId, setDragId] = React.useState<string | null>(null)
  const [dragRect, setDragRect] = React.useState<GridContextValue["dragRect"]>(null)
  const [keyboardId, setKeyboardId] = React.useState<string | null>(null)
  const keyboardBase = React.useRef<Array<LayoutItem> | null>(null)
  const [announcement, setAnnouncement] = React.useState("")
  const lastEmitted = React.useRef<Array<LayoutItem>>(layout)
  const gestureCleanup = React.useRef<(() => void) | null>(null)
  const pendingFocusId = React.useRef<string | null>(null)
  const warnedKeys = React.useRef(new Set<string>())
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
      pendingFocusId.current = null
    }
  }, [effectiveMode])

  React.useEffect(() => {
    if (activeWidgetDrag === null) {
      setDropHoverCell(null)
      dropStepsRef.current = null
    }
  }, [activeWidgetDrag])

  const rendered = React.useMemo(
    () => (preview ?? layout).map((item) => clamp(item, columns)),
    [preview, layout, columns]
  )

  const itemsById = React.useMemo(() => {
    const map = new Map<string, LayoutItem>()
    for (const item of rendered) {
      if (map.has(item.id)) continue
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

  /* Where a gesture's result comes to rest. Under `none` the layout is already
     final: collisions were resolved inside moveItem/resizeItem, so only the
     upward float is skipped and tiles still cannot overlap. */
  const settleLayout = React.useCallback(
    (next: Array<LayoutItem>) => (compaction === "none" ? next : compact(next)),
    [compaction]
  )

  const dragPlaceholderItem = React.useMemo(() => {
    if (!dragId) return undefined
    return settleLayout(preview ?? layout).find((item) => item.id === dragId)
  }, [dragId, preview, layout, settleLayout])

  React.useEffect(() => {
    if (!isDevelopment) return
    const warnOnce = (key: string, log: () => void) => {
      if (warnedKeys.current.has(key)) return
      warnedKeys.current.add(key)
      log()
    }
    const layoutIds = new Set<string>()
    for (const item of layout) {
      if (layoutIds.has(item.id)) {
        warnOnce(`duplicate:${item.id}`, () =>
          console.error(
            `DashboardGrid: duplicate layout id "${item.id}"; first occurrence wins.`
          )
        )
        continue
      }
      layoutIds.add(item.id)
    }
    const elements = React.Children.toArray(children).filter(
      (child): child is React.ReactElement<DashboardWidgetProps> =>
        React.isValidElement(child) &&
        typeof (child.props as { id?: unknown }).id === "string"
    )
    const childIds = new Set(elements.map((element) => element.props.id))
    for (const element of elements) {
      const id = element.props.id
      if (!layoutIds.has(id)) {
        warnOnce(`widget:${id}`, () =>
          console.warn(
            `DashboardGrid: widget "${id}" has no layout item and will not render.`
          )
        )
      }
      if (element.type !== DashboardWidget) {
        warnOnce(`type:${id}`, () =>
          console.warn(
            `DashboardGrid: child "${id}" is not a DashboardWidget element; if it does not render a DashboardWidget internally it will not appear on the grid.`
          )
        )
      }
    }
    for (const id of layoutIds) {
      if (!childIds.has(id)) {
        warnOnce(`layout:${id}`, () =>
          console.warn(`DashboardGrid: layout item "${id}" has no matching widget.`)
        )
      }
    }
  }, [layout, children])

  const announce = (message: string) => setAnnouncement(message)

  const commitLayout = (next: Array<LayoutItem>) => {
    const settled = settleLayout(next)
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

  const onHistoryChangeRef = React.useRef(onHistoryChange)
  onHistoryChangeRef.current = onHistoryChange

  React.useEffect(() => {
    onHistoryChangeRef.current?.({ canUndo, canRedo })
  }, [canUndo, canRedo])

  /** If focus is on a widget's move handle, arm it for re-focus once the restored layout re-renders. */
  const armFocusRestoreFromActiveElement = () => {
    const active = document.activeElement
    if (active instanceof HTMLElement && rootRef.current?.contains(active)) {
      const widgetId = active.dataset.widgetId
      if (widgetId) pendingFocusId.current = widgetId
    }
  }

  const undo = () => {
    const current = historyRef.current
    if (current.index === 0) return
    armFocusRestoreFromActiveElement()
    const restored = current.stack[current.index - 1]
    setHistory({ stack: current.stack, index: current.index - 1 })
    lastEmitted.current = restored
    onLayoutChange?.(restored)
    announce("Undo.")
  }

  const redo = () => {
    const current = historyRef.current
    if (current.index >= current.stack.length - 1) return
    armFocusRestoreFromActiveElement()
    const restored = current.stack[current.index + 1]
    setHistory({ stack: current.stack, index: current.index + 1 })
    lastEmitted.current = restored
    onLayoutChange?.(restored)
    announce("Redo.")
  }

  const removeWidget = (id: string) => {
    const next = removeItem(layout, id, compaction)
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

  /**
   * True when it is safe to steal focus back to `id`'s move handle after a
   * commit: activeElement is unset (body/null) or already inside that
   * widget's own section. Never steals focus from an unrelated element.
   */
  const shouldArmFocusFor = (id: string): boolean => {
    const active = document.activeElement
    if (active === null || active === document.body) return true
    const section = rootRef.current
      ?.querySelector(`[data-slot="dashboard-widget-move"][data-widget-id="${id}"]`)
      ?.closest('[data-slot="dashboard-widget"]')
    return section != null && section.contains(active)
  }

  /**
   * Shared pointer-gesture lifecycle for drag and resize: guards re-entrancy,
   * tracks base/current layout across pointermove, and commits (or cancels)
   * on pointerup/pointercancel/Escape. `create` supplies the axis-specific
   * math and any extra visual state (drag uses this for dragId/dragRect).
   */
  const beginGesture = (
    event: React.PointerEvent<HTMLElement>,
    id: string,
    create: (context: {
      origin: LayoutItem
      cellWidth: number
      stepX: number
      stepY: number
    }) => {
      move: (dx: number, dy: number, base: Array<LayoutItem>) => Array<LayoutItem>
      commitMessage: (settledItem: LayoutItem) => string
      /** Announced when the gesture ended where it began, so the live region
          never claims a move that did not happen. */
      unchangedMessage: (settledItem: LayoutItem) => string
      start?: () => void
      end?: () => void
      /** Only the drag gesture reorders relative focus; resize never needs a re-focus. */
      armFocusOnCommit?: boolean
    }
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
    const { cellWidth, stepX, stepY } = gridSteps(node, columns, rowHeight, gap)
    const handlers = create({ origin, cellWidth, stepX, stepY })
    const startX = event.clientX
    const startY = event.clientY
    const base = layout
    let current = base
    handlers.start?.()
    setPreview(base)

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      current = handlers.move(dx, dy, base)
      setPreview(current)
    }
    const finish = (commit: boolean) => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("keydown", onKeyDown, true)
      window.removeEventListener("pointercancel", onPointerCancel)
      gestureCleanup.current = null
      handlers.end?.()
      setPreview(null)
      if (commit && current !== base) {
        const settled = settleLayout(current)
        const settledItem = settled.find((item) => item.id === id)!
        /* A genuine no-op must not fire onLayoutChange or push a history entry,
           so the equality guard stays. Under `vertical` a real drag CAN still
           settle back onto its start row, because that is what gravity means;
           `compaction: "none"` is what makes such a drag stick. */
        if (layoutsEqual(settled, base)) {
          announce(handlers.unchangedMessage(settledItem))
        } else {
          commitLayout(settled)
          if (handlers.armFocusOnCommit && shouldArmFocusFor(id)) {
            pendingFocusId.current = id
          }
          announce(handlers.commitMessage(settledItem))
        }
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

  const startDrag = (id: string, event: React.PointerEvent<HTMLElement>) => {
    beginGesture(event, id, ({ origin, cellWidth, stepX, stepY }) => {
      const rect = {
        left: origin.x * stepX,
        top: origin.y * stepY,
        width: origin.w * cellWidth + (origin.w - 1) * gap,
        height: origin.h * rowHeight + (origin.h - 1) * gap,
      }
      return {
        start: () => {
          setDragId(id)
          setDragRect(rect)
        },
        end: () => {
          setDragId(null)
          setDragRect(null)
        },
        move: (dx, dy, base) => {
          setDragRect({ ...rect, left: rect.left + dx, top: rect.top + dy })
          const targetX = Math.round((rect.left + dx) / stepX)
          const targetY = Math.round((rect.top + dy) / stepY)
          return moveItem(base, id, targetX, targetY, columns, compaction)
        },
        commitMessage: (settled) => `Moved to column ${settled.x + 1}, row ${settled.y + 1}.`,
        unchangedMessage: (settled) =>
          `Not moved. Still at column ${settled.x + 1}, row ${settled.y + 1}.`,
        armFocusOnCommit: true,
      }
    })
  }

  const startResize = (
    id: string,
    handle: ResizeHandle | "both" | "x" | "y",
    event: React.PointerEvent<HTMLElement>
  ) => {
    const anchor = LEGACY_RESIZE_HANDLES[handle] ?? (handle as ResizeHandle)
    beginGesture(event, id, ({ origin, stepX, stepY }) => ({
      move: (dx, dy, base) => {
        const rect = resizeRect(
          origin,
          anchor,
          Math.round(dx / stepX),
          Math.round(dy / stepY),
          columns
        )
        return resizeItem(base, id, rect.w, rect.h, columns, {
          x: rect.x,
          y: rect.y,
          compaction,
        })
      },
      commitMessage: (settled) => `Resized to ${settled.w} by ${settled.h} cells.`,
      unchangedMessage: (settled) =>
        `Not resized. Still ${settled.w} by ${settled.h} cells.`,
    }))
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
      let settledLayout = working
      if (working !== keyboardBase.current) {
        settledLayout = settleLayout(working)
        if (!layoutsEqual(settledLayout, keyboardBase.current!)) {
          commitLayout(settledLayout)
          pendingFocusId.current = id
        }
      }
      const settled = settledLayout.find((candidate) => candidate.id === id)!
      announce(`${title} placed at column ${settled.x + 1}, row ${settled.y + 1}.`)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setKeyboardId(null)
      setPreview(null)
      const committed = keyboardBase.current!.find((candidate) => candidate.id === id)!
      announce(
        `Move cancelled. ${title} returned to column ${committed.x + 1}, row ${committed.y + 1}.`
      )
    } else if (event.key in arrowDeltas) {
      event.preventDefault()
      const [dx, dy] = arrowDeltas[event.key]
      const next = event.shiftKey
        ? resizeItem(working, id, item.w + dx, item.h + dy, columns, {
            compaction,
          })
        : moveItem(working, id, item.x + dx, item.y + dy, columns, compaction)
      if (next === working) {
        announce(
          event.shiftKey ? `${title} cannot resize further.` : `${title} cannot move further.`
        )
        return
      }
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
    const target = event.target as HTMLElement
    if (
      target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT"
    ) {
      return
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
      event.preventDefault()
      if (event.shiftKey) redo()
      else undo()
    }
  }

  const cancelKeyboard = (id: string, title: string) => {
    if (keyboardId !== id) return
    const committed = keyboardBase.current?.find((candidate) => candidate.id === id)
    setKeyboardId(null)
    setPreview(null)
    if (committed) {
      announce(
        `Move cancelled. ${title} returned to column ${committed.x + 1}, row ${committed.y + 1}.`
      )
    }
  }

  /* children render in y-then-x order so tab order and collapsed order match the visual layout */
  const widgets = React.useMemo(() => {
    const elements = React.Children.toArray(children).filter(
      (child): child is React.ReactElement<DashboardWidgetProps> =>
        React.isValidElement(child) &&
        typeof (child.props as { id?: unknown }).id === "string"
    )
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

  const showDropOverlay =
    effectiveMode === "edit" && onWidgetDrop != null && activeWidgetDrag !== null

  /** Reads (and caches for the duration of the current drag) the grid's cell sizing, so `clientWidth` is not re-read on every drop-move event. */
  const getDropSteps = (node: HTMLElement) => {
    if (!dropStepsRef.current) {
      dropStepsRef.current = gridSteps(node, columns, rowHeight, gap)
    }
    return dropStepsRef.current
  }

  const handleWidgetDropMove = (event: DropMoveEvent) => {
    const node = rootRef.current
    if (!node) return
    setDropHoverCell(pointToCell(event.x, event.y, getDropSteps(node), columns))
  }

  const handleWidgetDrop = async (event: DropEvent) => {
    const node = rootRef.current
    const item = event.items.find(
      (candidate): candidate is TextDropItem =>
        candidate.kind === "text" && candidate.types.has(WIDGET_DRAG_TYPE)
    )
    if (!node || !item) return
    const { type } = JSON.parse(await item.getText(WIDGET_DRAG_TYPE)) as { type: string }
    onWidgetDrop?.(type, pointToCell(event.x, event.y, getDropSteps(node), columns))
    setDropHoverCell(null)
    dropStepsRef.current = null
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
        {dropHoverCell && (
          <div
            data-slot="dashboard-grid-placeholder"
            aria-hidden="true"
            className="pointer-events-none rounded-lg border-2 border-dashed border-foreground/25 bg-muted/60"
            style={{
              gridColumn: `${dropHoverCell.x + 1} / span 1`,
              gridRow: `${dropHoverCell.y + 1} / span 1`,
            }}
          />
        )}
        {showDropOverlay && (
          <DropZone
            aria-label="Drop a widget"
            className={({ isDropTarget }: { isDropTarget: boolean }) =>
              cn("absolute inset-0 z-40 rounded-lg", isDropTarget && "ring-2 ring-primary")
            }
            getDropOperation={(types) => (types.has(WIDGET_DRAG_TYPE) ? "move" : "cancel")}
            onDropMove={handleWidgetDropMove}
            onDrop={handleWidgetDrop}
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
  const editMode = context.mode === "edit" && !context.collapsed
  /* static widgets never move/resize, but they still get the toolbar (e.g. remove) */
  const movable = editMode && !item.static
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
        className={cn(
          "flex items-center gap-1 border-b border-border/50 py-2",
          /* clears the 24px `nw`/`ne` handles so both stay grabbable */
          movable ? "px-7" : "px-3"
        )}
      >
        {movable && (
          <button
            type="button"
            data-slot="dashboard-widget-move"
            data-widget-id={id}
            aria-label={`Move ${title}`}
            className="relative z-40 shrink-0 cursor-grab touch-none rounded p-1 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
            onPointerDown={(event) => context.startDrag(id, event)}
            onKeyDown={(event) => context.handleKeyDown(id, title, event)}
            onBlur={() => context.cancelKeyboard(id, title)}
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
        {editMode && toolbar != null && (
          <WidgetContext.Provider value={widgetValue}>
            <span className="relative z-40 flex items-center gap-1">
              {toolbar}
            </span>
          </WidgetContext.Provider>
        )}
      </header>
      <div
        data-slot="dashboard-widget-body"
        className="min-w-0 flex-1 overflow-auto p-3"
      >
        {children}
      </div>
      {movable &&
        RESIZE_HANDLES.map(({ handle, axis, className: handleClassName }) => (
          <div
            key={handle}
            data-slot="dashboard-widget-resize"
            data-handle={handle}
            data-axis={axis}
            aria-hidden="true"
            className={cn(
              "absolute z-20 touch-none opacity-0 transition-opacity group-focus-within/widget:opacity-100 group-hover/widget:opacity-100 hover:opacity-100",
              handleClassName
            )}
            onPointerDown={(event) => context.startResize(id, handle, event)}
          />
        ))}
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
