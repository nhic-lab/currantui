import * as React from "react"
import { ScatterChart as ScatterSeries } from "echarts/charts"
import { GridComponent, TooltipComponent } from "echarts/components"
import * as echarts from "echarts/core"

import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import { formatNumber } from "@nhic/currantui-charts/lib/format"
import { baseGrid, valueAxis } from "@nhic/currantui-charts/lib/option-base"
import { paletteVar } from "@nhic/currantui-charts/lib/theme"

import type { EChartsCoreOption } from "echarts/core"
import type { ChartTableColumn } from "@nhic/currantui-charts/lib/table-columns"
import type {
  AxisChartOptions,
  ScatterDataRow,
} from "@nhic/currantui-charts/lib/types"

echarts.use([ScatterSeries, GridComponent, TooltipComponent])

export interface ScatterChartOptions extends AxisChartOptions {
  /** Mark diameter in px; defaults to 9 */
  pointSize?: number
  /** Table/CSV column header for the group column */
  groupLabel?: string
}

export interface ScatterChartProps {
  data: Array<ScatterDataRow>
  options: ScatterChartOptions
  className?: string
}

function scatterGroups(rows: ReadonlyArray<ScatterDataRow>): Array<string> {
  return [...new Set(rows.map((row) => row.group))]
}

function ScatterChart({ data, options, className }: ScatterChartProps) {
  const buildOption = React.useCallback((): EChartsCoreOption => {
    const groups = scatterGroups(data)
    const format = options.valueFormatter ?? formatNumber
    return {
      grid: baseGrid({
        left: Boolean(options.yAxis?.label),
        bottom: Boolean(options.xAxis?.label),
      }),
      tooltip: {
        trigger: "item",
        confine: true,
        formatter: (params: { seriesName?: string; value?: unknown }) => {
          const [x, y] = Array.isArray(params.value) ? params.value : [0, 0]
          return `${params.seriesName ?? ""}: ${format(Number(x))}, ${format(Number(y))}`
        },
      },
      xAxis: {
        ...valueAxis(options.xAxis, options.valueFormatter),
        nameGap: 28,
      },
      yAxis: valueAxis(options.yAxis, options.valueFormatter),
      series: groups.map((group) => ({
        name: group,
        type: "scatter" as const,
        symbolSize: options.pointSize ?? 9,
        data: data
          .filter((row) => row.group === group)
          .map((row) => [row.x, row.y]),
      })),
    }
  }, [data, options])

  const legendItems = React.useMemo(
    () =>
      scatterGroups(data).map((group, index) => ({
        label: group,
        color: paletteVar(index),
      })),
    [data]
  )

  const tableColumns = React.useMemo(
    (): Array<ChartTableColumn<ScatterDataRow>> => [
      { header: options.groupLabel ?? "Group", value: (row) => row.group },
      { header: options.xAxis?.label ?? "X", value: (row) => row.x },
      { header: options.yAxis?.label ?? "Y", value: (row) => row.y },
    ],
    [options.groupLabel, options.xAxis, options.yAxis]
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

export { ScatterChart }
