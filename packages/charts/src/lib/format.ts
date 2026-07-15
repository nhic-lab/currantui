const numberFormat = new Intl.NumberFormat("en-US")

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

/** Table-cell display formatting; numbers get digit grouping, the rest passes through */
export function formatCell(value: unknown): string {
  if (typeof value === "number") return formatNumber(value)
  if (value == null) return ""
  return String(value)
}
