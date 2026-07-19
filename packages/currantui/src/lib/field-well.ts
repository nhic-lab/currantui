import type { PivotAggregate, PivotConfig } from "@nhic/currantui/lib/pivot"

export interface WellField {
  id: string
  label: string
  /** Matching key for well `accepts`, e.g. "dimension" | "measure" */
  type?: string
  /** Measures only; consumed by pivotConfigFromWells (default "sum") */
  aggregate?: PivotAggregate
}

export interface FieldWellDefinition {
  id: string
  label: string
  /** WellField.type values this well admits; omit to admit all */
  accepts?: Array<string>
  /** Maximum chips; a full single-slot well (maxItems: 1) replaces on drop */
  maxItems?: number
}

export type FieldWellValue = Record<string, Array<WellField>>

export interface FieldMove {
  field: WellField
  /** Source well id; undefined = dragged from the source field list (copy) */
  from?: string
  /** Target well id; undefined = dropped outside wells (remove from `from`) */
  to?: string
  /** Insertion index in the target well; append when omitted */
  index?: number
}

/**
 * Well semantics: fields are copied in from the source list and never leave
 * it; moves happen between wells, reordering happens within a well, and
 * target-less moves remove the field. Rejected or no-op moves return the
 * input reference so callers can skip emission.
 */
export function applyFieldMove(
  value: FieldWellValue,
  wells: Array<FieldWellDefinition>,
  move: FieldMove
): FieldWellValue {
  const { field, from, to } = move
  const wellById = new Map(wells.map((well) => [well.id, well]))
  if (from !== undefined && !wellById.has(from)) return value
  if (to !== undefined && !wellById.has(to)) return value
  if (to === undefined) {
    if (from === undefined) return value
    const source = value[from] ?? []
    const next = source.filter((candidate) => candidate.id !== field.id)
    if (next.length === source.length) return value
    return { ...value, [from]: next }
  }

  const target = wellById.get(to)!
  if (
    target.accepts &&
    (field.type === undefined || !target.accepts.includes(field.type))
  ) {
    return value
  }

  const targetItems = value[to] ?? []
  const reorder = from === to

  if (reorder) {
    const currentIndex = targetItems.findIndex(
      (candidate) => candidate.id === field.id
    )
    if (currentIndex === -1) return value
    const requested = Math.min(
      Math.max(move.index ?? targetItems.length, 0),
      targetItems.length
    )
    const insertAt = requested > currentIndex ? requested - 1 : requested
    if (insertAt === currentIndex) return value
    const without = targetItems.filter((candidate) => candidate.id !== field.id)
    const nextItems = [
      ...without.slice(0, insertAt),
      targetItems[currentIndex],
      ...without.slice(insertAt),
    ]
    return { ...value, [to]: nextItems }
  }

  if (targetItems.some((candidate) => candidate.id === field.id)) return value
  if (target.maxItems !== undefined && targetItems.length >= target.maxItems) {
    if (target.maxItems !== 1) return value
    const next = { ...value, [to]: [field] }
    if (from !== undefined) {
      next[from] = (value[from] ?? []).filter(
        (candidate) => candidate.id !== field.id
      )
    }
    return next
  }

  const index = Math.min(
    Math.max(move.index ?? targetItems.length, 0),
    targetItems.length
  )
  const next = {
    ...value,
    [to]: [...targetItems.slice(0, index), field, ...targetItems.slice(index)],
  }
  if (from !== undefined) {
    next[from] = (value[from] ?? []).filter(
      (candidate) => candidate.id !== field.id
    )
  }
  return next
}

/** Null when the rows or values well is empty — callers show an empty state */
export function pivotConfigFromWells(
  value: FieldWellValue,
  mapping: { rows: string; columns?: string; values: string }
): PivotConfig | null {
  const rows = (value[mapping.rows] ?? []).map((field) => field.id)
  const values = (value[mapping.values] ?? []).map((field) => ({
    field: field.id,
    aggregate: field.aggregate ?? ("sum" as const),
    label: field.label,
  }))
  if (rows.length === 0 || values.length === 0) return null
  const columns = mapping.columns
    ? (value[mapping.columns] ?? []).map((field) => field.id)
    : []
  return columns.length > 0 ? { rows, columns, values } : { rows, values }
}
