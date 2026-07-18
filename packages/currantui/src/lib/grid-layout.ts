export interface LayoutItem {
  id: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  static?: boolean
}

/** Axis-aligned overlap test; an item never collides with itself (by id). */
export function collides(a: LayoutItem, b: LayoutItem): boolean {
  if (a.id === b.id) return false
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  )
}

/** Enforce grid bounds and min/max constraints. Returns `item` untouched when already valid. */
export function clamp(item: LayoutItem, columns: number): LayoutItem {
  const w = Math.min(Math.max(item.w, item.minW ?? 1), item.maxW ?? columns, columns)
  const h = Math.max(Math.min(item.h, item.maxH ?? Number.MAX_SAFE_INTEGER), item.minH ?? 1)
  const x = Math.min(Math.max(item.x, 0), columns - w)
  const y = Math.max(item.y, 0)
  if (x === item.x && y === item.y && w === item.w && h === item.h) return item
  return { ...item, x, y, w, h }
}

/**
 * Gravity: every non-static item floats to the lowest free row, scanning in
 * y-then-x order so upper items settle first. `pinnedId` (the item mid-gesture)
 * is treated like a static item for its own position but still blocks others.
 * Returns the input array reference when nothing moved.
 */
export function compact(layout: Array<LayoutItem>, pinnedId?: string): Array<LayoutItem> {
  const sorted = [...layout].sort((a, b) => a.y - b.y || a.x - b.x)
  const placed: Array<LayoutItem> = []
  const byId = new Map<string, LayoutItem>()
  for (const item of sorted) {
    let candidate = item
    if (!item.static && item.id !== pinnedId) {
      while (candidate.y > 0) {
        const up = { ...candidate, y: candidate.y - 1 }
        if (placed.some((p) => collides(up, p))) break
        candidate = up
      }
    }
    placed.push(candidate)
    byId.set(candidate.id, candidate)
  }
  const result = layout.map((item) => byId.get(item.id)!)
  return result.every((item, index) => item === layout[index]) ? layout : result
}

/**
 * Push every non-static item colliding with the seed down below it,
 * cascading. A non-static seed colliding with a static item is itself
 * shifted below the static. Terminates because y only ever grows.
 */
function resolveCollisions(layout: Array<LayoutItem>, seedId: string): Array<LayoutItem> {
  const items = layout.map((item) => ({ ...item }))
  const queue = [seedId]
  while (queue.length > 0) {
    const id = queue.shift()!
    const current = items.find((candidate) => candidate.id === id)!
    for (const other of items) {
      if (other.static || other.id === current.id) continue
      if (collides(current, other)) {
        other.y = current.y + current.h
        queue.push(other.id)
      }
    }
    if (!current.static) {
      for (const other of items) {
        if (other.static && collides(current, other)) {
          current.y = other.y + other.h
          queue.push(current.id)
          break
        }
      }
    }
  }
  return items
}

export function moveItem(
  layout: Array<LayoutItem>,
  id: string,
  x: number,
  y: number,
  columns: number
): Array<LayoutItem> {
  const target = layout.find((item) => item.id === id)
  if (!target || target.static) return layout
  const placed = clamp({ ...target, x, y }, columns)
  if (placed.x === target.x && placed.y === target.y) return layout
  const next = layout.map((item) => (item.id === id ? placed : item))
  return compact(resolveCollisions(next, id), id)
}

export function resizeItem(
  layout: Array<LayoutItem>,
  id: string,
  w: number,
  h: number,
  columns: number
): Array<LayoutItem> {
  const target = layout.find((item) => item.id === id)
  if (!target || target.static) return layout
  const sized = clamp({ ...target, w, h }, columns)
  if (sized.w === target.w && sized.h === target.h && sized.x === target.x) return layout
  const next = layout.map((item) => (item.id === id ? sized : item))
  return compact(resolveCollisions(next, id), id)
}

export function removeItem(layout: Array<LayoutItem>, id: string): Array<LayoutItem> {
  const next = layout.filter((item) => item.id !== id)
  return next.length === layout.length ? layout : compact(next)
}

/** First free w×h position scanning y-then-x; below everything when nothing fits. */
export function findSlot(
  layout: Array<LayoutItem>,
  w: number,
  h: number,
  columns: number
): { x: number; y: number } {
  const width = Math.max(1, Math.min(w, columns))
  const height = Math.max(1, h)
  const maxY = layout.reduce((max, item) => Math.max(max, item.y + item.h), 0)
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x + width <= columns; x++) {
      const probe: LayoutItem = { id: "__probe__", x, y, w: width, h: height }
      if (!layout.some((item) => collides(probe, item))) return { x, y }
    }
  }
  return { x: 0, y: maxY }
}
