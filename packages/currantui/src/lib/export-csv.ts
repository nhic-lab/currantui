export interface CsvColumn<T> {
  header: string
  value: (row: T) => unknown
}

function toCell(value: unknown): string {
  if (value == null) return ""
  const text = Array.isArray(value) ? value.join("+") : String(value)
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

/** Serialize rows to CSV and trigger a browser download */
export function exportRowsToCsv<T>(
  rows: Array<T>,
  columns: Array<CsvColumn<T>>,
  filename: string,
): void {
  const csv = [
    columns.map((c) => toCell(c.header)).join(","),
    ...rows.map((row) => columns.map((c) => toCell(c.value(row))).join(",")),
  ].join("\n")

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  const a = document.createElement("a")
  a.href = url
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
