import { describe, expect, it } from "vitest"

import { pivotData, valueLabel } from "@nhic/currantui/lib/pivot"
import type { PivotConfig } from "@nhic/currantui/lib/pivot"

const records = [
  { province: "Kigali", district: "Gasabo", quarter: "Q1", reports: 40, onTime: 36 },
  { province: "Kigali", district: "Gasabo", quarter: "Q2", reports: 44, onTime: 40 },
  { province: "Kigali", district: "Kicukiro", quarter: "Q1", reports: 30, onTime: 24 },
  { province: "North", district: "Musanze", quarter: "Q1", reports: 26, onTime: 20 },
  { province: "North", district: "Musanze", quarter: "Q2", reports: 28, onTime: 27 },
]

const sumReports = { field: "reports", aggregate: "sum" } as const

describe("valueLabel", () => {
  it("defaults to aggregate(field) and honors explicit labels", () => {
    expect(valueLabel(sumReports)).toBe("sum(reports)")
    expect(valueLabel({ ...sumReports, label: "Reports" })).toBe("Reports")
  })
})

describe("pivotData rows", () => {
  const config: PivotConfig = { rows: ["province", "district"], values: [sumReports] }

  it("nests row fields in order with first-seen ordering", () => {
    const result = pivotData(records, config)
    expect(result.rows.map((node) => node.label)).toEqual(["Kigali", "North"])
    expect(result.rows[0].children.map((node) => node.label)).toEqual([
      "Gasabo",
      "Kicukiro",
    ])
    expect(result.rows[0].children[0].depth).toBe(1)
  })

  it("aggregates branch cells over all descendant records", () => {
    const result = pivotData(records, config)
    const key = result.columnKeys[0].key
    expect(result.rows[0].cells.get(key)).toBe(114) // Kigali: 40+44+30
    expect(result.rows[0].children[0].cells.get(key)).toBe(84) // Gasabo
    expect(result.totals.get(key)).toBe(168)
  })
})

describe("pivotData columns", () => {
  const config: PivotConfig = {
    rows: ["district"],
    columns: ["quarter"],
    values: [sumReports, { field: "onTime", aggregate: "mean" }],
  }

  it("orders column keys path-major, values in config order", () => {
    const result = pivotData(records, config)
    expect(result.columnKeys.map((column) => [column.path[0], valueLabel(column.value)])).toEqual([
      ["Q1", "sum(reports)"],
      ["Q1", "mean(onTime)"],
      ["Q2", "sum(reports)"],
      ["Q2", "mean(onTime)"],
    ])
  })

  it("computes mean from raw records, never averaged averages", () => {
    const result = pivotData(records, config)
    const q1Mean = result.columnKeys[1].key
    expect(result.totals.get(q1Mean)).toBeCloseTo((36 + 24 + 20) / 3)
  })

  it("leaves cells with no contributing records undefined", () => {
    const result = pivotData(records, config)
    const q2Sum = result.columnKeys[2].key
    const kicukiro = result.rows.find((node) => node.label === "Kicukiro")!
    expect(kicukiro.cells.get(q2Sum)).toBeUndefined()
  })
})

describe("pivotData aggregates and edge cases", () => {
  it("supports count, min, and max", () => {
    const config: PivotConfig = {
      rows: ["province"],
      values: [
        { field: "reports", aggregate: "count" },
        { field: "reports", aggregate: "min" },
        { field: "reports", aggregate: "max" },
      ],
    }
    const result = pivotData(records, config)
    const kigali = result.rows[0]
    expect(kigali.cells.get(result.columnKeys[0].key)).toBe(3)
    expect(kigali.cells.get(result.columnKeys[1].key)).toBe(30)
    expect(kigali.cells.get(result.columnKeys[2].key)).toBe(44)
  })

  it("ignores non-numeric values for numeric aggregates but counts the record", () => {
    const dirty = [
      { district: "Gasabo", reports: 10 },
      { district: "Gasabo", reports: "n/a" },
    ]
    const config: PivotConfig = {
      rows: ["district"],
      values: [sumReports, { field: "reports", aggregate: "count" }],
    }
    const result = pivotData(dirty, config)
    expect(result.rows[0].cells.get(result.columnKeys[0].key)).toBe(10)
    expect(result.rows[0].cells.get(result.columnKeys[1].key)).toBe(2)
  })

  it("groups missing row-field values under the em dash", () => {
    const result = pivotData(
      [{ reports: 5 }, { district: "Gasabo", reports: 7 }],
      { rows: ["district"], values: [sumReports] }
    )
    expect(result.rows.map((node) => node.label)).toEqual(["—", "Gasabo"])
  })

  it("does not mutate its input", () => {
    const input = records.map((record) => ({ ...record }))
    const snapshot = JSON.parse(JSON.stringify(input))
    pivotData(input, { rows: ["province"], values: [sumReports] })
    expect(input).toEqual(snapshot)
  })

  it("keeps columns distinct when value configs share a label", () => {
    const result = pivotData(records, {
      rows: ["province"],
      values: [
        { field: "reports", aggregate: "sum", label: "Reports" },
        { field: "onTime", aggregate: "sum", label: "Reports" },
      ],
    })
    expect(result.columnKeys).toHaveLength(2)
    expect(new Set(result.columnKeys.map((column) => column.key)).size).toBe(2)
    const kigali = result.rows[0]
    expect(kigali.cells.get(result.columnKeys[0].key)).toBe(114)
    expect(kigali.cells.get(result.columnKeys[1].key)).toBe(100)
  })
})
