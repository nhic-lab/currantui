import type { CsvColumn } from "@nhic/currantui/lib/export-csv"
import type { ChartDataRow } from "@nhic/currantui-charts/lib/types"

/** One column of the shell's table view; the same shape feeds the CSV export */
export type ChartTableColumn<TRow> = CsvColumn<TRow>

export function groupedRowColumns(headers?: {
  group?: string
  key?: string
  value?: string
}): Array<ChartTableColumn<ChartDataRow>> {
  return [
    { header: headers?.group ?? "Group", value: (row) => row.group },
    { header: headers?.key ?? "Key", value: (row) => row.key },
    { header: headers?.value ?? "Value", value: (row) => row.value },
  ]
}
