import { describe, expect, it } from "vitest"

import {
  clearSelections,
  isValueSelected,
  toggleSelection,
} from "@nhic/currantui-charts/lib/cross-filter"
import type { CrossFilterSelection } from "@nhic/currantui-charts/lib/cross-filter"

const sel = (dimension: string, ...values: Array<string | number>): CrossFilterSelection => ({
  dimension,
  values,
})

describe("toggleSelection (plain click)", () => {
  it("selects a value on an empty state", () => {
    expect(toggleSelection([], "district", "Gasabo")).toEqual([sel("district", "Gasabo")])
  })

  it("replaces the dimension's selection", () => {
    const state = [sel("district", "Gasabo"), sel("sex", "F")]
    expect(toggleSelection(state, "district", "Musanze")).toEqual([
      sel("district", "Musanze"),
      sel("sex", "F"),
    ])
  })

  it("clears the dimension when the value is its only selection", () => {
    const state = [sel("district", "Gasabo"), sel("sex", "F")]
    expect(toggleSelection(state, "district", "Gasabo")).toEqual([sel("sex", "F")])
  })

  it("replaces a multi-value selection with the clicked value", () => {
    const state = [sel("district", "Gasabo", "Musanze")]
    expect(toggleSelection(state, "district", "Gasabo")).toEqual([sel("district", "Gasabo")])
  })
})

describe("toggleSelection (additive)", () => {
  it("adds a second value to the dimension", () => {
    const state = [sel("district", "Gasabo")]
    expect(toggleSelection(state, "district", "Musanze", true)).toEqual([
      sel("district", "Gasabo", "Musanze"),
    ])
  })

  it("removes a selected value, keeping the rest", () => {
    const state = [sel("district", "Gasabo", "Musanze")]
    expect(toggleSelection(state, "district", "Gasabo", true)).toEqual([
      sel("district", "Musanze"),
    ])
  })

  it("drops the dimension when its last value is removed", () => {
    const state = [sel("district", "Gasabo"), sel("sex", "F")]
    expect(toggleSelection(state, "district", "Gasabo", true)).toEqual([sel("sex", "F")])
  })

  it("starts a dimension additively on an empty state", () => {
    expect(toggleSelection([], "district", "Gasabo", true)).toEqual([sel("district", "Gasabo")])
  })
})

describe("clearSelections", () => {
  it("clears one dimension", () => {
    const state = [sel("district", "Gasabo"), sel("sex", "F")]
    expect(clearSelections(state, "district")).toEqual([sel("sex", "F")])
  })

  it("clears everything without a dimension", () => {
    expect(clearSelections([sel("district", "Gasabo")])).toEqual([])
  })

  it("returns the same reference on no-ops", () => {
    const state = [sel("district", "Gasabo")]
    expect(clearSelections(state, "unknown")).toBe(state)
    expect(clearSelections([])).toEqual([])
    const empty: Array<CrossFilterSelection> = []
    expect(clearSelections(empty)).toBe(empty)
  })
})

describe("isValueSelected", () => {
  it("reports membership per dimension", () => {
    const state = [sel("district", "Gasabo")]
    expect(isValueSelected(state, "district", "Gasabo")).toBe(true)
    expect(isValueSelected(state, "district", "Musanze")).toBe(false)
    expect(isValueSelected(state, "sex", "Gasabo")).toBe(false)
  })
})
