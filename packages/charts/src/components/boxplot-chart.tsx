import * as React from "react"
import {
  BoxplotChart as BoxplotSeries,
  ScatterChart as ScatterSeries,
} from "echarts/charts"
import { GridComponent, TooltipComponent } from "echarts/components"
import * as echarts from "echarts/core"

import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import { formatNumber } from "@nhic/currantui-charts/lib/format"
import {
  baseGrid,
  categoryAxis,
  valueAxis,
} from "@nhic/currantui-charts/lib/option-base"
import { computeBoxStats } from "@nhic/currantui-charts/lib/stats"

import type { EChartsCoreOption } from "echarts/core"
import type { BoxStats } from "@nhic/currantui-charts/lib/stats"
import type { ChartTableColumn } from "@nhic/currantui-charts/lib/table-columns"
import type {
  AxisChartOptions,
  BoxplotDataRow,
} from "@nhic/currantui-charts/lib/types"

echarts.use([BoxplotSeries, ScatterSeries, GridComponent, TooltipComponent])

export interface BoxplotChartOptions extends AxisChartOptions {
  /** Table/CSV column header for the group column */
  groupLabel?: string
}

export interface BoxplotChartProps {
  /** Raw samples per group; quartiles, whiskers, and outliers are computed */
  data: Array<BoxplotDataRow>
  options: BoxplotChartOptions
  className?: string
}

interface GroupStats extends BoxStats {
  group: string
}

function computeGroupStats(
  rows: ReadonlyArray<BoxplotDataRow>
): Array<GroupStats> {
  const groups = [...new Set(rows.map((row) => row.group))]
  return groups.flatMap((group) => {
    const stats = computeBoxStats(
      rows.filter((row) => row.group === group).map((row) => row.value)
    )
    return stats ? [{ group, ...stats }] : []
  })
}

function BoxplotChart({ data, options, className }: BoxplotChartProps) {
  const stats = React.useMemo(() => computeGroupStats(data), [data])
  const format = options.valueFormatter ?? formatNumber

  const buildOption = React.useCallback((): EChartsCoreOption => {
    const statLabels = ["Low", "Q1", "Median", "Q3", "High"]
    return {
      grid: baseGrid({
        left: Boolean(options.yAxis?.label),
        bottom: Boolean(options.xAxis?.label),
      }),
      tooltip: {
        trigger: "item",
        confine: true,
        formatter: (params: {
          seriesType?: string
          name?: string
          value?: unknown
        }) => {
          if (params.seriesType === "boxplot" && Array.isArray(params.value)) {
            const numbers = params.value.slice(1, 6).map(Number)
            const lines = numbers.map(
              (stat, i) => `${statLabels[i]}: ${format(stat)}`
            )
            return `${params.name ?? ""}<br/>${lines.join("<br/>")}`
          }
          const [, value] = Array.isArray(params.value) ? params.value : [0, 0]
          return `Outlier: ${format(Number(value))}`
        },
      },
      xAxis: categoryAxis(
        stats.map((entry) => entry.group),
        options.xAxis
      ),
      yAxis: valueAxis(options.yAxis, options.valueFormatter),
      series: [
        {
          name: "Distribution",
          type: "boxplot" as const,
          boxWidth: [12, 48],
          data: stats.map((entry) => [
            entry.low,
            entry.q1,
            entry.median,
            entry.q3,
            entry.high,
          ]),
        },
        {
          name: "Outliers",
          type: "scatter" as const,
          symbolSize: 7,
          data: stats.flatMap((entry, index) =>
            entry.outliers.map((value) => [index, value])
          ),
        },
      ],
    }
  }, [stats, format, options])

  const tableColumns = React.useMemo(
    (): Array<ChartTableColumn<GroupStats>> => [
      { header: options.groupLabel ?? "Group", value: (row) => row.group },
      { header: "Low", value: (row) => row.low },
      { header: "Q1", value: (row) => row.q1 },
      { header: "Median", value: (row) => row.median },
      { header: "Q3", value: (row) => row.q3 },
      { header: "High", value: (row) => row.high },
      { header: "Outliers", value: (row) => row.outliers.length },
    ],
    [options.groupLabel]
  )

  return (
    <ChartShell
      options={options}
      rows={stats}
      tableColumns={tableColumns}
      buildOption={buildOption}
      className={className}
    />
  )
}

export { BoxplotChart }
