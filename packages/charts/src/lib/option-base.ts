import { formatNumber } from "@nhic/currantui-charts/lib/format"

import type { AxisOptions, ChartDataRow } from "@nhic/currantui-charts/lib/types"

/** Unique groups in first-appearance order — the fixed series order */
export function groupsOf(rows: ReadonlyArray<ChartDataRow>): Array<string> {
  return [...new Set(rows.map((row) => row.group))]
}

/** Unique category keys in first-appearance order */
export function keysOf(rows: ReadonlyArray<ChartDataRow>): Array<string | number> {
  return [...new Set(rows.map((row) => row.key))]
}

/** Per-group values aligned to `keys`, null where a group has no row */
export function valuesByGroup(
  rows: ReadonlyArray<ChartDataRow>,
  groups: ReadonlyArray<string>,
  keys: ReadonlyArray<string | number>
): Map<string, Array<number | null>> {
  const index = new Map<string, number>()
  rows.forEach((row) => index.set(`${row.group}\u0000${row.key}`, row.value))
  return new Map(
    groups.map((group) => [
      group,
      keys.map((key) => index.get(`${group}\u0000${key}`) ?? null),
    ])
  )
}

/**
 * Compact plot insets. `containLabel` reserves room for tick labels but not
 * axis names — pass which sides carry a name so it isn't clipped; the right
 * inset absorbs the last tick label's overhang.
 */
export function baseGrid(axisNames?: {
  left?: boolean
  bottom?: boolean
  right?: boolean
}): Record<string, unknown> {
  return {
    top: 12,
    right: axisNames?.right ? 30 : 24,
    bottom: axisNames?.bottom ? 34 : 4,
    // Covers the rotated name even when tick labels are narrow (single digits)
    left: axisNames?.left ? 40 : 4,
    containLabel: true,
  }
}

export function baseTooltip(
  valueFormatter?: (value: number) => string
): Record<string, unknown> {
  const format = valueFormatter ?? formatNumber
  return {
    confine: true,
    valueFormatter: (value: unknown) =>
      typeof value === "number" ? format(value) : String(value ?? ""),
  }
}

export function categoryAxis(
  labels: ReadonlyArray<string>,
  axis?: AxisOptions
): Record<string, unknown> {
  return {
    type: "category",
    data: [...labels],
    name: axis?.label,
    nameLocation: "middle",
    nameGap: 28,
  }
}

export function valueAxis(
  axis?: AxisOptions,
  valueFormatter?: (value: number) => string
): Record<string, unknown> {
  const format = axis?.formatter ?? valueFormatter ?? formatNumber
  return {
    type: "value",
    name: axis?.label,
    nameLocation: "middle",
    nameGap: 44,
    axisLabel: { formatter: (value: number) => format(value) },
  }
}
