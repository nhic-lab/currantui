export type PivotAggregate = "sum" | "count" | "mean" | "min" | "max"

export interface PivotValueConfig {
  field: string
  aggregate: PivotAggregate
  /** Column heading; defaults to `${aggregate}(${field})` */
  label?: string
  /** Applied by PivotTable at render time */
  formatter?: (value: number) => string
}

export interface PivotConfig {
  /** At least one row field; nesting follows array order */
  rows: Array<string>
  columns?: Array<string>
  values: Array<PivotValueConfig>
}

export interface PivotColumnKey {
  /** One entry per configured column field; empty for row-only pivots */
  path: Array<string>
  value: PivotValueConfig
  key: string
}

export interface PivotRowNode {
  label: string
  depth: number
  key: string
  children: Array<PivotRowNode>
  /** Aggregated cell per PivotColumnKey.key; branch nodes carry subtotals */
  cells: Map<string, number | undefined>
}

export interface PivotResult {
  columnKeys: Array<PivotColumnKey>
  rows: Array<PivotRowNode>
  totals: Map<string, number | undefined>
}

const SEPARATOR = "\u0000"

export function valueLabel(value: PivotValueConfig): string {
  return value.label ?? `${value.aggregate}(${value.field})`
}

function fieldValue(record: Record<string, unknown>, field: string): string {
  const raw = record[field]
  return raw === undefined || raw === null ? "—" : String(raw)
}

function aggregate(
  records: Array<Record<string, unknown>>,
  value: PivotValueConfig
): number | undefined {
  if (value.aggregate === "count") {
    return records.length === 0 ? undefined : records.length
  }
  const numbers: Array<number> = []
  for (const record of records) {
    const raw = record[value.field]
    if (typeof raw === "number" && Number.isFinite(raw)) numbers.push(raw)
  }
  if (numbers.length === 0) return undefined
  switch (value.aggregate) {
    case "sum":
      return numbers.reduce((total, current) => total + current, 0)
    case "mean":
      return numbers.reduce((total, current) => total + current, 0) / numbers.length
    case "min":
      return Math.min(...numbers)
    case "max":
      return Math.max(...numbers)
  }
}

export function pivotData(
  data: Array<Record<string, unknown>>,
  config: PivotConfig
): PivotResult {
  const columnFields = config.columns ?? []

  /* column paths in first-seen order; a single empty path for row-only pivots */
  const pathOrder: Array<string> = []
  const pathsByKey = new Map<string, Array<string>>()
  if (columnFields.length === 0) {
    pathOrder.push("")
    pathsByKey.set("", [])
  } else {
    for (const record of data) {
      const path = columnFields.map((field) => fieldValue(record, field))
      const key = path.join(SEPARATOR)
      if (!pathsByKey.has(key)) {
        pathsByKey.set(key, path)
        pathOrder.push(key)
      }
    }
  }

  const columnKeys: Array<PivotColumnKey> = pathOrder.flatMap((pathKey) =>
    config.values.map((value, index) => ({
      path: pathsByKey.get(pathKey)!,
      value,
      key: `${pathKey}${SEPARATOR}${index}`,
    }))
  )

  const cellsFor = (records: Array<Record<string, unknown>>) => {
    const cells = new Map<string, number | undefined>()
    for (const column of columnKeys) {
      const matching =
        column.path.length === 0
          ? records
          : records.filter((record) =>
              columnFields.every(
                (field, index) => fieldValue(record, field) === column.path[index]
              )
            )
      cells.set(column.key, aggregate(matching, column.value))
    }
    return cells
  }

  const buildNodes = (
    records: Array<Record<string, unknown>>,
    depth: number,
    parentKey: string
  ): Array<PivotRowNode> => {
    const field = config.rows[depth]
    const order: Array<string> = []
    const groups = new Map<string, Array<Record<string, unknown>>>()
    for (const record of records) {
      const label = fieldValue(record, field)
      if (!groups.has(label)) {
        groups.set(label, [])
        order.push(label)
      }
      groups.get(label)!.push(record)
    }
    return order.map((label) => {
      const groupRecords = groups.get(label)!
      const key = parentKey === "" ? label : `${parentKey}${SEPARATOR}${label}`
      return {
        label,
        depth,
        key,
        children:
          depth + 1 < config.rows.length
            ? buildNodes(groupRecords, depth + 1, key)
            : [],
        cells: cellsFor(groupRecords),
      }
    })
  }

  return {
    columnKeys,
    rows: buildNodes(data, 0, ""),
    totals: cellsFor(data),
  }
}
