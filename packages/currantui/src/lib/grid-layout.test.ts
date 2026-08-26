import { describe, expect, it } from "vitest"

import {
  clamp,
  collides,
  compact,
  findSlot,
  layoutsEqual,
  moveItem,
  removeItem,
  resizeItem,
  resizeRect,
} from "@nhic/currantui/lib/grid-layout"
import type { LayoutItem } from "@nhic/currantui/lib/grid-layout"

function item(
  id: string,
  x: number,
  y: number,
  w = 1,
  h = 1,
  rest: Partial<LayoutItem> = {}
): LayoutItem {
  return { id, x, y, w, h, ...rest }
}

describe("collides", () => {
  it("detects overlapping items", () => {
    expect(collides(item("a", 0, 0, 2, 2), item("b", 1, 1, 2, 2))).toBe(true)
  })

  it("treats edge-adjacent items as non-colliding", () => {
    expect(collides(item("a", 0, 0, 2, 2), item("b", 2, 0, 2, 2))).toBe(false)
    expect(collides(item("a", 0, 0, 2, 2), item("b", 0, 2, 2, 2))).toBe(false)
  })

  it("never collides with itself", () => {
    const a = item("a", 0, 0, 2, 2)
    expect(collides(a, { ...a })).toBe(false)
  })
})

describe("clamp", () => {
  it("enforces minW/minH and maxW/maxH", () => {
    expect(clamp(item("a", 0, 0, 1, 1, { minW: 2, minH: 3 }), 12)).toMatchObject({ w: 2, h: 3 })
    expect(clamp(item("a", 0, 0, 9, 9, { maxW: 4, maxH: 5 }), 12)).toMatchObject({ w: 4, h: 5 })
  })

  it("caps width at the column count", () => {
    expect(clamp(item("a", 0, 0, 20, 1), 12).w).toBe(12)
  })

  it("pulls overflowing items back inside the grid", () => {
    expect(clamp(item("a", 10, 0, 4, 1), 12)).toMatchObject({ x: 8, w: 4 })
    expect(clamp(item("a", -2, -3, 2, 2), 12)).toMatchObject({ x: 0, y: 0 })
  })

  it("returns the same reference when nothing changes", () => {
    const a = item("a", 1, 1, 2, 2)
    expect(clamp(a, 12)).toBe(a)
  })
})

describe("compact", () => {
  it("floats items up into empty space, preserving columns", () => {
    const layout = [item("a", 0, 3, 2, 2), item("b", 4, 5)]
    const result = compact(layout)
    expect(result.find((i) => i.id === "a")).toMatchObject({ x: 0, y: 0 })
    expect(result.find((i) => i.id === "b")).toMatchObject({ x: 4, y: 0 })
  })

  it("stacks items in the same column without overlap", () => {
    const layout = [item("a", 0, 2, 2, 2), item("b", 0, 6, 2, 1)]
    const result = compact(layout)
    expect(result.find((i) => i.id === "a")).toMatchObject({ y: 0 })
    expect(result.find((i) => i.id === "b")).toMatchObject({ y: 2 })
  })

  it("never moves static items and does not float through them", () => {
    const layout = [item("s", 0, 2, 2, 1, { static: true }), item("a", 0, 5, 2, 1)]
    const result = compact(layout)
    expect(result.find((i) => i.id === "s")).toMatchObject({ y: 2 })
    expect(result.find((i) => i.id === "a")).toMatchObject({ y: 3 })
  })

  it("keeps a pinned item in place while others compact around it", () => {
    const layout = [item("pin", 0, 3, 2, 1), item("b", 4, 4)]
    const result = compact(layout, "pin")
    expect(result.find((i) => i.id === "pin")).toMatchObject({ y: 3 })
    expect(result.find((i) => i.id === "b")).toMatchObject({ y: 0 })
  })

  it("is idempotent and returns the same reference when already compact", () => {
    const layout = [item("a", 0, 0, 2, 2), item("b", 0, 2, 2, 1)]
    expect(compact(layout)).toBe(layout)
    const once = compact([item("a", 0, 4, 2, 2)])
    expect(compact(once)).toBe(once)
  })

  it("preserves input order and does not mutate inputs", () => {
    const layout = [item("b", 4, 5), item("a", 0, 3)]
    const snapshot = JSON.parse(JSON.stringify(layout))
    const result = compact(layout)
    expect(result.map((i) => i.id)).toEqual(["b", "a"])
    expect(layout).toEqual(snapshot)
  })

  it("keeps a pinned item mid-column blocked by items above and below", () => {
    const layout = [
      item("above", 2, 0, 2, 1),
      item("pin", 2, 3, 2, 1),
      item("below", 2, 5, 2, 1),
    ]
    const result = compact(layout, "pin")
    expect(result.find((i) => i.id === "above")).toMatchObject({ y: 0 })
    expect(result.find((i) => i.id === "pin")).toMatchObject({ y: 3 })
    expect(result.find((i) => i.id === "below")).toMatchObject({ y: 4 })
  })
})

describe("layoutsEqual", () => {
  it("is true for structurally identical layouts", () => {
    const layout = [item("a", 0, 0, 2, 2), item("b", 2, 0, 2, 2)]
    expect(layoutsEqual(layout, [...layout])).toBe(true)
  })

  it("is false when items are reordered", () => {
    const a = [item("a", 0, 0), item("b", 1, 0)]
    const b = [item("b", 1, 0), item("a", 0, 0)]
    expect(layoutsEqual(a, b)).toBe(false)
  })

  it("is false when an item moved", () => {
    const a = [item("a", 0, 0)]
    const b = [item("a", 1, 0)]
    expect(layoutsEqual(a, b)).toBe(false)
  })

  it("is false when an item resized", () => {
    const a = [item("a", 0, 0, 2, 2)]
    const b = [item("a", 0, 0, 3, 2)]
    expect(layoutsEqual(a, b)).toBe(false)
  })
})

describe("moveItem", () => {
  it("pushes collided items down in a chain", () => {
    const layout = [
      item("facilities", 0, 0, 3, 2),
      item("on-time", 3, 0, 3, 2),
      item("submissions", 6, 0, 6, 4),
      item("districts", 0, 2, 6, 2),
    ]
    const moved = moveItem(layout, "facilities", 3, 0, 12)
    expect(moved.find((i) => i.id === "facilities")).toMatchObject({ x: 3, y: 0 })
    expect(moved.find((i) => i.id === "on-time")).toMatchObject({ x: 3, y: 2 })
    expect(moved.find((i) => i.id === "districts")).toMatchObject({ y: 4 })
    const committed = compact(moved)
    expect(committed.find((i) => i.id === "on-time")).toMatchObject({ x: 3, y: 2 })
  })

  it("swaps with a neighbour when dragged past it", () => {
    const layout = [item("a", 0, 0), item("b", 0, 1), item("c", 0, 2)]
    const committed = compact(moveItem(layout, "a", 0, 2, 12))
    expect(committed.find((i) => i.id === "b")).toMatchObject({ y: 0 })
    expect(committed.find((i) => i.id === "a")).toMatchObject({ y: 1 })
    expect(committed.find((i) => i.id === "c")).toMatchObject({ y: 2 })
  })

  it("flows around static items instead of displacing them", () => {
    const layout = [item("a", 0, 0), item("s", 0, 1, 1, 1, { static: true })]
    const moved = moveItem(layout, "a", 0, 1, 12)
    expect(moved.find((i) => i.id === "s")).toMatchObject({ y: 1 })
    expect(moved.find((i) => i.id === "a")).toMatchObject({ y: 2 })
  })

  it("returns the same reference for no-ops", () => {
    const layout = [item("a", 0, 0), item("s", 4, 0, 1, 1, { static: true })]
    expect(moveItem(layout, "a", 0, 0, 12)).toBe(layout)
    expect(moveItem(layout, "missing", 2, 2, 12)).toBe(layout)
    expect(moveItem(layout, "s", 2, 2, 12)).toBe(layout)
  })
})

describe("resizeItem", () => {
  it("pushes items uncovered by growth down", () => {
    const layout = [
      item("facilities", 0, 0, 3, 2),
      item("on-time", 3, 0, 3, 2),
      item("districts", 0, 2, 6, 2),
    ]
    const resized = resizeItem(layout, "facilities", 4, 2, 12)
    expect(resized.find((i) => i.id === "facilities")).toMatchObject({ w: 4 })
    expect(resized.find((i) => i.id === "on-time")).toMatchObject({ x: 3, y: 2 })
    expect(resized.find((i) => i.id === "districts")).toMatchObject({ y: 4 })
  })

  it("clamps to constraints and the grid edge", () => {
    const layout = [item("a", 10, 0, 2, 1, { maxH: 2 })]
    const resized = resizeItem(layout, "a", 6, 9, 12)
    expect(resized.find((i) => i.id === "a")).toMatchObject({ x: 6, w: 6, h: 2 })
  })

  it("returns the same reference for no-ops", () => {
    const layout = [item("a", 0, 0, 2, 2)]
    expect(resizeItem(layout, "a", 2, 2, 12)).toBe(layout)
  })
})

describe("removeItem", () => {
  it("removes and closes the gap", () => {
    const layout = [item("a", 0, 0, 2, 2), item("b", 0, 2, 2, 2)]
    const result = removeItem(layout, "a")
    expect(result.map((i) => i.id)).toEqual(["b"])
    expect(result[0]).toMatchObject({ y: 0 })
  })

  it("returns the same reference when the id is absent", () => {
    const layout = [item("a", 0, 0)]
    expect(removeItem(layout, "zzz")).toBe(layout)
  })
})

describe("findSlot", () => {
  it("finds the first gap scanning y then x", () => {
    const layout = [item("a", 0, 0, 6, 2), item("b", 8, 0, 4, 2)]
    expect(findSlot(layout, 2, 2, 12)).toEqual({ x: 6, y: 0 })
  })

  it("appends below everything when no gap fits", () => {
    const layout = [item("a", 0, 0, 12, 3)]
    expect(findSlot(layout, 4, 2, 12)).toEqual({ x: 0, y: 3 })
  })

  it("places the first widget at the origin", () => {
    expect(findSlot([], 4, 2, 12)).toEqual({ x: 0, y: 0 })
  })
})

/* The defect this suite was extended for: a tall chart sitting BESIDE a short
   number card could not be left on the second row. Nothing blocked the upward
   float, so gravity pulled it back to row 0 — and because the settled layout
   then equalled the pre-gesture layout, DashboardGrid never even emitted it.
   Geometry taken from a real dashboard: a 3x2 VALUE card at 0,0 and a 5x4 chart
   aligned with it on row 0. */
describe("compaction: free placement beside a shorter tile", () => {
  const card = item("card", 0, 0, 3, 2)
  const chart = item("chart", 3, 0, 6, 4)
  const board = [card, chart]

  it("reverts the row move under vertical gravity, but only once unpinned", () => {
    /* mid-gesture the dragged tile is pinned, so the PREVIEW honours row 2 */
    const moved = moveItem(board, "chart", 3, 2, 12, "vertical")
    expect(moved.find((i) => i.id === "chart")!.y).toBe(2)
    /* DashboardGrid then settles with an UNPINNED compact() on pointerup, and
       that is where the row move is lost */
    const settled = compact(moved)
    expect(settled.find((i) => i.id === "chart")!.y).toBe(0)
    expect(layoutsEqual(settled, board)).toBe(true)
  })

  it("keeps the tile on the second row when compaction is none", () => {
    const moved = moveItem(board, "chart", 3, 2, 12, "none")
    expect(moved.find((i) => i.id === "chart")).toMatchObject({ x: 3, y: 2 })
    expect(moved.find((i) => i.id === "card")).toMatchObject({ x: 0, y: 0 })
  })

  it("emits a layout that differs from the base, so the gesture is observable", () => {
    const moved = moveItem(board, "chart", 3, 2, 12, "none")
    expect(layoutsEqual(moved, board)).toBe(false)
  })

  it("still refuses to overlap: a tile dropped onto another pushes it down", () => {
    const moved = moveItem(board, "chart", 0, 0, 12, "none")
    expect(moved.find((i) => i.id === "chart")).toMatchObject({ x: 0, y: 0 })
    expect(moved.find((i) => i.id === "card")!.y).toBe(4)
    for (const a of moved) {
      for (const b of moved) expect(collides(a, b)).toBe(false)
    }
  })

  it("defaults to vertical, so an existing caller is unaffected", () => {
    expect(
      layoutsEqual(moveItem(board, "chart", 3, 2, 12), moveItem(board, "chart", 3, 2, 12, "vertical"))
    ).toBe(true)
  })

  it("leaves a gap behind a removal only when compaction is none", () => {
    const stack = [item("a", 0, 0, 2, 2), item("b", 0, 2, 2, 2)]
    expect(removeItem(stack, "a", "none")[0]).toMatchObject({ id: "b", y: 2 })
    expect(removeItem(stack, "a")[0]).toMatchObject({ id: "b", y: 0 })
  })
})

/* Every handle must be reachable, not merely rendered. Before 0.10 `resizeItem`
   took only (w, h) and `clamp` preserved x/y, so the top and left edges could
   not be dragged at all. */
describe("resizeRect", () => {
  const origin = item("t", 4, 2, 4, 4, { minW: 2, minH: 2 })

  it("grows east and south from a fixed top-left", () => {
    expect(resizeRect(origin, "e", 2, 0, 12)).toEqual({ x: 4, y: 2, w: 6, h: 4 })
    expect(resizeRect(origin, "s", 0, 3, 12)).toEqual({ x: 4, y: 2, w: 4, h: 7 })
    expect(resizeRect(origin, "se", 2, 3, 12)).toEqual({ x: 4, y: 2, w: 6, h: 7 })
  })

  it("grows west and north by moving the origin, keeping the far edge fixed", () => {
    expect(resizeRect(origin, "w", -2, 0, 12)).toEqual({ x: 2, y: 2, w: 6, h: 4 })
    expect(resizeRect(origin, "n", 0, -2, 12)).toEqual({ x: 4, y: 0, w: 4, h: 6 })
    expect(resizeRect(origin, "nw", -2, -2, 12)).toEqual({ x: 2, y: 0, w: 6, h: 6 })
    expect(resizeRect(origin, "ne", 2, -2, 12)).toEqual({ x: 4, y: 0, w: 6, h: 6 })
    expect(resizeRect(origin, "sw", -2, 3, 12)).toEqual({ x: 2, y: 2, w: 6, h: 7 })
  })

  it("parks the dragged edge at minW/minH instead of sliding the anchor", () => {
    /* right edge is 8 and must not move: shrinking from the west stops at minW */
    expect(resizeRect(origin, "w", 99, 0, 12)).toEqual({ x: 6, y: 2, w: 2, h: 4 })
    /* bottom edge is 6 and must not move */
    expect(resizeRect(origin, "n", 0, 99, 12)).toEqual({ x: 4, y: 4, w: 4, h: 2 })
  })

  it("stops at the grid edges rather than growing past them", () => {
    expect(resizeRect(origin, "w", -99, 0, 12)).toEqual({ x: 0, y: 2, w: 8, h: 4 })
    expect(resizeRect(origin, "n", 0, -99, 12)).toEqual({ x: 4, y: 0, w: 4, h: 6 })
    expect(resizeRect(origin, "e", 99, 0, 12)).toEqual({ x: 4, y: 2, w: 8, h: 4 })
  })

  it("honours maxW and maxH against the anchored edge", () => {
    const capped = item("t", 4, 2, 4, 4, { maxW: 5, maxH: 5 })
    expect(resizeRect(capped, "w", -4, 0, 12)).toEqual({ x: 3, y: 2, w: 5, h: 4 })
    expect(resizeRect(capped, "n", 0, -4, 12)).toEqual({ x: 4, y: 1, w: 4, h: 5 })
  })
})

describe("resizeItem origin-moving", () => {
  it("moves x and y when they are supplied", () => {
    const board = [item("t", 4, 2, 4, 4)]
    const next = resizeItem(board, "t", 6, 6, 12, { x: 2, y: 0, compaction: "none" })
    expect(next[0]).toMatchObject({ x: 2, y: 0, w: 6, h: 6 })
  })

  it("is unchanged for a caller that passes no origin", () => {
    const board = [item("t", 4, 2, 4, 4)]
    expect(resizeItem(board, "t", 6, 4, 12)[0]).toMatchObject({ x: 4, y: 2, w: 6, h: 4 })
  })

  it("returns the input when nothing actually changed", () => {
    const board = [item("t", 4, 2, 4, 4)]
    expect(resizeItem(board, "t", 4, 4, 12, { x: 4, y: 2 })).toBe(board)
  })

  it("pushes a collided neighbour down instead of overlapping it", () => {
    const board = [item("t", 4, 2, 4, 2), item("below", 4, 4, 4, 2)]
    const next = resizeItem(board, "t", 4, 4, 12, { compaction: "none" })
    expect(next.find((i) => i.id === "below")!.y).toBe(6)
  })
})
