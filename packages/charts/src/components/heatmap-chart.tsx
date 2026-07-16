import * as React from "react"
import { HeatmapChart as HeatmapSeries } from "echarts/charts"
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components"
import * as echarts from "echarts/core"

import { ChartRampLegend } from "@nhic/currantui-charts/components/chart-ramp-legend"
import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import { formatNumber } from "@nhic/currantui-charts/lib/format"
import { baseGrid, categoryAxis } from "@nhic/currantui-charts/lib/option-base"
import { resolveTokenColor } from "@nhic/currantui-charts/lib/theme"

import type { EChartsCoreOption } from "echarts/core"
import type { ChartTableColumn } from "@nhic/currantui-charts/lib/table-columns"
import type {
  AxisChartOptions,
  HeatmapDataRow,
} from "@nhic/currantui-charts/lib/types"

echarts.use([
  HeatmapSeries,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
])

export interface HeatmapChartOptions extends AxisChartOptions {
  /** Name of the measure, used by the ramp legend and table view */
  valueLabel?: string
}

export interface HeatmapChartProps {
  data: Array<HeatmapDataRow>
  options: HeatmapChartOptions
  className?: string
}

function uniqueInOrder(values: ReadonlyArray<string>): Array<string> {
  return [...new Set(values)]
}

function HeatmapChart({ data, options, className }: HeatmapChartProps) {
  const format = options.valueFormatter ?? formatNumber
  const domain = React.useMemo(() => {
    const values = data.map((row) => row.value)
    return {
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
    }
  }, [data])

  const buildOption = React.useCallback((): EChartsCoreOption => {
    const xKeys = uniqueInOrder(data.map((row) => row.x))
    const yKeys = uniqueInOrder(data.map((row) => row.y))
    return {
      grid: {
        ...baseGrid({ bottom: Boolean(options.xAxis?.label) }),
        // The y name sits horizontally above the axis (see below)
        top: options.yAxis?.label ? 28 : 12,
        left: 4,
      },
      tooltip: {
        trigger: "item",
        confine: true,
        formatter: (params: { value?: unknown }) => {
          const [x, y, value] = Array.isArray(params.value)
            ? params.value
            : ["", "", 0]
          return `${String(x)} · ${String(y)}: ${format(Number(value))}`
        },
      },
      xAxis: categoryAxis(xKeys, options.xAxis),
      // A rotated middle name collides with wide category labels; place it
      // horizontally above the axis instead
      yAxis: {
        ...categoryAxis(yKeys, options.yAxis),
        nameLocation: "end",
        nameGap: 14,
      },
      // Mapping only — the HTML ramp legend replaces the canvas control
      visualMap: {
        show: false,
        min: domain.min,
        max: domain.max,
        inRange: {
          color: [
            resolveTokenColor("--chart-2", 0.12),
            resolveTokenColor("--chart-2"),
          ],
        },
      },
      series: [
        {
          type: "heatmap" as const,
          itemStyle: {
            borderColor: resolveTokenColor("--card"),
            borderWidth: 1,
          },
          data: data.map((row) => [row.x, row.y, row.value]),
        },
      ],
    }
  }, [data, domain, format, options])

  const tableColumns = React.useMemo(
    (): Array<ChartTableColumn<HeatmapDataRow>> => [
      { header: options.xAxis?.label ?? "X", value: (row) => row.x },
      { header: options.yAxis?.label ?? "Y", value: (row) => row.y },
      { header: options.valueLabel ?? "Value", value: (row) => row.value },
    ],
    [options.xAxis, options.yAxis, options.valueLabel]
  )

  return (
    <ChartShell
      options={options}
      rows={data}
      tableColumns={tableColumns}
      legendContent={
        <ChartRampLegend
          label={options.valueLabel}
          minLabel={format(domain.min)}
          maxLabel={format(domain.max)}
        />
      }
      buildOption={buildOption}
      className={className}
    />
  )
}

export { HeatmapChart }
