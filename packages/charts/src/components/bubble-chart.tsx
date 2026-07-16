import * as React from "react"
import { ScatterChart as ScatterSeries } from "echarts/charts"
import { GridComponent, TooltipComponent } from "echarts/components"
import * as echarts from "echarts/core"

import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import { formatNumber } from "@nhic/currantui-charts/lib/format"
import { baseGrid, valueAxis } from "@nhic/currantui-charts/lib/option-base"
import { scaleSqrt } from "@nhic/currantui-charts/lib/stats"
import { paletteVar } from "@nhic/currantui-charts/lib/theme"

import type { EChartsCoreOption } from "echarts/core"
import type { ChartBuildContext } from "@nhic/currantui-charts/components/chart-shell"
import type { ChartTableColumn } from "@nhic/currantui-charts/lib/table-columns"
import type {
  AxisChartOptions,
  BubbleDataRow,
} from "@nhic/currantui-charts/lib/types"

echarts.use([ScatterSeries, GridComponent, TooltipComponent])

export interface BubbleChartOptions extends AxisChartOptions {
  /** Mark diameter range in px; defaults to [8, 36] */
  sizeRange?: [number, number]
  /** Name of the size measure, used in tooltips and the table view */
  sizeLabel?: string
  /** Table/CSV column header for the group column */
  groupLabel?: string
}

export interface BubbleChartProps {
  data: Array<BubbleDataRow>
  options: BubbleChartOptions
  className?: string
}

function bubbleGroups(rows: ReadonlyArray<BubbleDataRow>): Array<string> {
  return [...new Set(rows.map((row) => row.group))]
}

function BubbleChart({ data, options, className }: BubbleChartProps) {
  const buildOption = React.useCallback((context: ChartBuildContext): EChartsCoreOption => {
    const groups = bubbleGroups(data)
    const format = options.valueFormatter ?? formatNumber
    const sizes = data.map((row) => row.size)
    const scale = scaleSqrt(
      [Math.min(0, ...sizes), Math.max(1, ...sizes)],
      options.sizeRange ?? [8, 36]
    )
    const sizeLabel = options.sizeLabel ?? "Size"
    return {
      grid: baseGrid({
        left: Boolean(options.yAxis?.label),
        bottom: Boolean(options.xAxis?.label),
      }),
      tooltip: {
        trigger: "item",
        confine: true,
        formatter: (params: { seriesName?: string; value?: unknown }) => {
          const [x, y, size] = Array.isArray(params.value)
            ? params.value
            : [0, 0, 0]
          return `${params.seriesName ?? ""}: ${format(Number(x))}, ${format(Number(y))} · ${sizeLabel}: ${format(Number(size))}`
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
        symbolSize: (value: Array<number>) => scale(value[2]),
        // Translucent fills keep overlapping bubbles readable
        itemStyle: { opacity: 0.75 },
        data: context.hiddenGroups.has(group)
          ? []
          : data
              .filter((row) => row.group === group)
              .map((row) => [row.x, row.y, row.size]),
      })),
    }
  }, [data, options])

  const legendItems = React.useMemo(
    () =>
      bubbleGroups(data).map((group, index) => ({
        label: group,
        color: paletteVar(index),
      })),
    [data]
  )

  const tableColumns = React.useMemo(
    (): Array<ChartTableColumn<BubbleDataRow>> => [
      { header: options.groupLabel ?? "Group", value: (row) => row.group },
      { header: options.xAxis?.label ?? "X", value: (row) => row.x },
      { header: options.yAxis?.label ?? "Y", value: (row) => row.y },
      { header: options.sizeLabel ?? "Size", value: (row) => row.size },
    ],
    [options.groupLabel, options.xAxis, options.yAxis, options.sizeLabel]
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

export { BubbleChart }
