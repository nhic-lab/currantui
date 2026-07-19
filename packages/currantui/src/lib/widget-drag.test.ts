import { afterEach, describe, expect, it, vi } from "vitest"

import {
  endWidgetDrag,
  getActiveWidgetDrag,
  startWidgetDrag,
  subscribeWidgetDrag,
} from "@nhic/currantui/lib/widget-drag"

afterEach(() => {
  endWidgetDrag()
})

describe("widget-drag store", () => {
  it("starts with no active drag", () => {
    expect(getActiveWidgetDrag()).toBeNull()
  })

  it("tracks the active type through start and end", () => {
    startWidgetDrag("kpi")
    expect(getActiveWidgetDrag()).toBe("kpi")
    endWidgetDrag()
    expect(getActiveWidgetDrag()).toBeNull()
  })

  it("notifies subscribers on start and end", () => {
    const listener = vi.fn()
    const unsubscribe = subscribeWidgetDrag(listener)
    startWidgetDrag("chart")
    endWidgetDrag()
    expect(listener).toHaveBeenCalledTimes(2)
    unsubscribe()
  })

  it("stops notifying after unsubscribe", () => {
    const listener = vi.fn()
    const unsubscribe = subscribeWidgetDrag(listener)
    unsubscribe()
    startWidgetDrag("table")
    expect(listener).not.toHaveBeenCalled()
  })

  it("does not notify on a redundant end", () => {
    const listener = vi.fn()
    subscribeWidgetDrag(listener)
    endWidgetDrag()
    expect(listener).not.toHaveBeenCalled()
  })
})
