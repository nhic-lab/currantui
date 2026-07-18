export interface CrossFilterSelection {
  dimension: string
  /** OR within a dimension; dimensions combine with AND */
  values: Array<string | number>
}

/**
 * Power BI click semantics. Plain toggle: replace the dimension's selection
 * with the value, or clear the dimension when the value is already its only
 * selection. Additive toggle (Ctrl/Cmd-click): add or remove the value; a
 * dimension emptied of values drops out entirely.
 */
export function toggleSelection(
  selections: Array<CrossFilterSelection>,
  dimension: string,
  value: string | number,
  additive = false
): Array<CrossFilterSelection> {
  const current = selections.find((selection) => selection.dimension === dimension)
  if (!additive) {
    if (current && current.values.length === 1 && current.values[0] === value) {
      return selections.filter((selection) => selection !== current)
    }
    const next = { dimension, values: [value] }
    return current
      ? selections.map((selection) => (selection === current ? next : selection))
      : [...selections, next]
  }
  if (!current) return [...selections, { dimension, values: [value] }]
  const values = current.values.includes(value)
    ? current.values.filter((candidate) => candidate !== value)
    : [...current.values, value]
  if (values.length === 0) {
    return selections.filter((selection) => selection !== current)
  }
  return selections.map((selection) =>
    selection === current ? { dimension, values } : selection
  )
}

export function clearSelections(
  selections: Array<CrossFilterSelection>,
  dimension?: string
): Array<CrossFilterSelection> {
  if (dimension === undefined) return selections.length === 0 ? selections : []
  const next = selections.filter((selection) => selection.dimension !== dimension)
  return next.length === selections.length ? selections : next
}

export function isValueSelected(
  selections: Array<CrossFilterSelection>,
  dimension: string,
  value: string | number
): boolean {
  return selections.some(
    (selection) => selection.dimension === dimension && selection.values.includes(value)
  )
}
