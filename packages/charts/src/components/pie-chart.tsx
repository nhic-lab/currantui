import * as React from "react"
import { PieChart as PieSeries } from "echarts/charts"
import { TooltipComponent } from "echarts/components"
import * as echarts from "echarts/core"

import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import { baseTooltip } from "@nhic/currantui-charts/lib/option-base"
import { partRowColumns } from "@nhic/currantui-charts/lib/table-columns"
import { paletteVar } from "@nhic/currantui-charts/lib/theme"

import type { EChartsCoreOption } from "echarts/core"
import type {
  BaseChartOptions,
  PartDataRow,
} from "@nhic/currantui-charts/lib/types"

echarts.use([PieSeries, TooltipComponent])

export interface PieChartOptions extends BaseChartOptions {
  /** Table/CSV column headers */
  groupLabel?: string
  valueLabel?: string
}

export interface PieChartProps {
  data: Array<PartDataRow>
  options: PieChartOptions
  className?: string
}

function PieChart({ data, options, className }: PieChartProps) {
  const buildOption = React.useCallback(
    (): EChartsCoreOption => ({
      tooltip: { trigger: "item", ...baseTooltip(options.valueFormatter) },
      series: [
        {
          type: "pie" as const,
          radius: "70%",
          // Names live in the HTML legend; canvas labels stay off
          label: { show: false },
          labelLine: { show: false },
          data: data.map((row) => ({ name: row.group, value: row.value })),
        },
      ],
    }),
    [data, options]
  )

  const legendItems = React.useMemo(
    () =>
      data.map((row, index) => ({
        label: row.group,
        color: paletteVar(index),
      })),
    [data]
  )

  const tableColumns = React.useMemo(
    () =>
      partRowColumns({
        group: options.groupLabel,
        value: options.valueLabel,
      }),
    [options.groupLabel, options.valueLabel]
  )

  return (
    <ChartShell
      options={options}
      rows={data}
      tableColumns={tableColumns}
      legendItems={legendItems}
      buildOption={buildOption}
      className={className}
    />
  )
}

export { PieChart }
