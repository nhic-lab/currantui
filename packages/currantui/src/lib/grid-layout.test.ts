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
