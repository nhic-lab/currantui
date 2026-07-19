import { describe, expect, it } from "vitest"

import { applyFieldMove, pivotConfigFromWells } from "@nhic/currantui/lib/field-well"
import type {
  FieldWellDefinition,
  FieldWellValue,
  WellField,
} from "@nhic/currantui/lib/field-well"

const dim = (id: string, label = id): WellField => ({ id, label, type: "dimension" })
const measure = (id: string, label = id): WellField => ({
  id,
  label,
  type: "measure",
})

const wells: Array<FieldWellDefinition> = [
  { id: "rows", label: "Rows", accepts: ["dimension"] },
  { id: "columns", label: "Columns", accepts: ["dimension"], maxItems: 1 },
  { id: "values", label: "Values", accepts: ["measure"] },
]

const empty: FieldWellValue = { rows: [], columns: [], values: [] }

describe("applyFieldMove — insert and move", () => {
  it("copies a field from the source list into a well (append)", () => {
    const next = applyFieldMove(empty, wells, { field: dim("district"), to: "rows" })
    expect(next.rows.map((field) => field.id)).toEqual(["district"])
  })

  it("inserts at an explicit index", () => {
    const value = { ...empty, rows: [dim("province"), dim("district")] }
    const next = applyFieldMove(value, wells, {
      field: dim("quarter"),
      to: "rows",
      index: 1,
    })
    expect(next.rows.map((field) => field.id)).toEqual([
      "province",
      "quarter",
      "district",
    ])
  })

  it("moves a field between wells, removing it from the source well", () => {
    const value = { ...empty, rows: [dim("district")] }
    const next = applyFieldMove(value, wells, {
      field: dim("district"),
      from: "rows",
      to: "columns",
    })
    expect(next.rows).toEqual([])
    expect(next.columns.map((field) => field.id)).toEqual(["district"])
  })

  it("removes a field when the move has no target well", () => {
    const value = { ...empty, values: [measure("reports")] }
    const next = applyFieldMove(value, wells, {
      field: measure("reports"),
      from: "values",
    })
    expect(next.values).toEqual([])
  })
})

describe("applyFieldMove — reorder", () => {
  const value = { ...empty, rows: [dim("a"), dim("b"), dim("c")] }

  it("reorders forward within a well", () => {
    const next = applyFieldMove(value, wells, {
      field: dim("a"),
      from: "rows",
      to: "rows",
      index: 3,
    })
    expect(next.rows.map((field) => field.id)).toEqual(["b", "c", "a"])
  })

  it("reorders backward within a well", () => {
    const next = applyFieldMove(value, wells, {
      field: dim("c"),
      from: "rows",
      to: "rows",
      index: 0,
    })
    expect(next.rows.map((field) => field.id)).toEqual(["c", "a", "b"])
  })

  it("returns the same reference for a same-position reorder", () => {
    expect(
      applyFieldMove(value, wells, { field: dim("b"), from: "rows", to: "rows", index: 1 })
    ).toBe(value)
    expect(
      applyFieldMove(value, wells, { field: dim("b"), from: "rows", to: "rows", index: 2 })
    ).toBe(value)
  })
})

describe("applyFieldMove — rejections (same reference)", () => {
  it("rejects a type the well does not accept", () => {
    const move = { field: measure("reports"), to: "rows" }
    expect(applyFieldMove(empty, wells, move)).toBe(empty)
  })

  it("rejects fields without a type when the well restricts types", () => {
    expect(
      applyFieldMove(empty, wells, { field: { id: "x", label: "x" }, to: "rows" })
    ).toBe(empty)
  })

  it("rejects a duplicate field id in the target well", () => {
    const value = { ...empty, rows: [dim("district")] }
    expect(
      applyFieldMove(value, wells, { field: dim("district"), to: "rows" })
    ).toBe(value)
  })

  it("rejects unknown well ids", () => {
    expect(applyFieldMove(empty, wells, { field: dim("d"), to: "nope" })).toBe(empty)
    expect(
      applyFieldMove(empty, wells, { field: dim("d"), from: "nope", to: "rows" })
    ).toBe(empty)
  })

  it("rejects when maxItems is reached (above one)", () => {
    const twoMax: Array<FieldWellDefinition> = [
      { id: "rows", label: "Rows", maxItems: 2 },
    ]
    const value: FieldWellValue = { rows: [dim("a"), dim("b")] }
    expect(applyFieldMove(value, twoMax, { field: dim("c"), to: "rows" })).toBe(value)
  })
})

describe("applyFieldMove — single-slot replacement", () => {
  it("replaces the occupant of a maxItems: 1 well", () => {
    const value = { ...empty, columns: [dim("quarter")] }
    const next = applyFieldMove(value, wells, { field: dim("province"), to: "columns" })
    expect(next.columns.map((field) => field.id)).toEqual(["province"])
  })

  it("removes the moved field from its source well when replacing", () => {
    const value = { ...empty, rows: [dim("province")], columns: [dim("quarter")] }
    const next = applyFieldMove(value, wells, {
      field: dim("province"),
      from: "rows",
      to: "columns",
    })
    expect(next.rows).toEqual([])
    expect(next.columns.map((field) => field.id)).toEqual(["province"])
  })
})

describe("applyFieldMove — purity", () => {
  it("does not mutate its input", () => {
    const value = { ...empty, rows: [dim("a")] }
    const snapshot = JSON.parse(JSON.stringify(value))
    applyFieldMove(value, wells, { field: dim("b"), to: "rows" })
    expect(value).toEqual(snapshot)
  })
})

describe("pivotConfigFromWells", () => {
  const mapping = { rows: "rows", columns: "columns", values: "values" }

  it("maps wells to a PivotConfig with aggregate defaults", () => {
    const value: FieldWellValue = {
      rows: [dim("district")],
      columns: [dim("quarter")],
      values: [
        { id: "reports", label: "Reports", type: "measure" },
        { id: "onTime", label: "On time", type: "measure", aggregate: "mean" },
      ],
    }
    expect(pivotConfigFromWells(value, mapping)).toEqual({
      rows: ["district"],
      columns: ["quarter"],
      values: [
        { field: "reports", aggregate: "sum", label: "Reports" },
        { field: "onTime", aggregate: "mean", label: "On time" },
      ],
    })
  })

  it("omits columns when the columns well is empty or unmapped", () => {
    const value: FieldWellValue = {
      rows: [dim("district")],
      columns: [],
      values: [measure("reports")],
    }
    expect(pivotConfigFromWells(value, mapping)).not.toHaveProperty("columns")
    expect(
      pivotConfigFromWells(value, { rows: "rows", values: "values" })
    ).not.toHaveProperty("columns")
  })

  it("returns null when rows or values are empty", () => {
    expect(
      pivotConfigFromWells({ ...empty, values: [measure("r")] }, mapping)
    ).toBeNull()
    expect(
      pivotConfigFromWells({ ...empty, rows: [dim("d")] }, mapping)
    ).toBeNull()
  })
})
