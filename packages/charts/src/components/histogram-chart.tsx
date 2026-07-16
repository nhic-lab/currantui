import * as React from "react"
import { BarChart as BarSeries } from "echarts/charts"
import { GridComponent, TooltipComponent } from "echarts/components"
import * as echarts from "echarts/core"

import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import { formatNumber } from "@nhic/currantui-charts/lib/format"
import {
  baseGrid,
  baseTooltip,
  categoryAxis,
  valueAxis,
} from "@nhic/currantui-charts/lib/option-base"
import { binRows } from "@nhic/currantui-charts/lib/stats"

import type { EChartsCoreOption } from "echarts/core"
import type { HistogramBin } from "@nhic/currantui-charts/lib/stats"
import type { ChartTableColumn } from "@nhic/currantui-charts/lib/table-columns"
import type { AxisChartOptions } from "@nhic/currantui-charts/lib/types"

echarts.use([BarSeries, GridComponent, TooltipComponent])

export interface HistogramChartOptions extends AxisChartOptions {
  /** Bin count; defaults to Sturges' rule */
  bins?: number
  /** Fixed bin width; takes precedence over `bins` */
  binWidth?: number
}

export interface HistogramChartProps {
  /** Raw sample values; binning happens internally */
  data: Array<number>
  options: HistogramChartOptions
  className?: string
}

function binLabel(bin: HistogramBin, format: (value: number) => string): string {
  return `${format(bin.x0)}–${format(bin.x1)}`
}

function HistogramChart({ data, options, className }: HistogramChartProps) {
  const format = options.valueFormatter ?? formatNumber
  const bins = React.useMemo(
    () => binRows(data, { bins: options.bins, binWidth: options.binWidth }),
    [data, options.bins, options.binWidth]
  )

  const buildOption = React.useCallback(
    (): EChartsCoreOption => ({
      grid: baseGrid({
        left: Boolean(options.yAxis?.label),
        bottom: Boolean(options.xAxis?.label),
      }),
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        ...baseTooltip(),
      },
      xAxis: categoryAxis(
        bins.map((bin) => binLabel(bin, format)),
        options.xAxis
      ),
      yAxis: valueAxis(options.yAxis),
      series: [
        {
          name: options.yAxis?.label ?? "Count",
          type: "bar" as const,
          // Contiguous bars read as a distribution, not categories
          barCategoryGap: "4%",
          data: bins.map((bin) => bin.count),
        },
      ],
    }),
    [bins, format, options]
  )

  const tableColumns = React.useMemo(
    (): Array<ChartTableColumn<HistogramBin>> => [
      {
        header: options.xAxis?.label ?? "Bin",
        value: (bin) => binLabel(bin, format),
      },
      { header: options.yAxis?.label ?? "Count", value: (bin) => bin.count },
    ],
    [options.xAxis, options.yAxis, format]
  )

  return (
    <ChartShell
      options={options}
      rows={bins}
      tableColumns={tableColumns}
      buildOption={buildOption}
      className={className}
    />
  )
}

export { HistogramChart }
