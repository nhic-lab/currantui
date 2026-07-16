import * as React from "react"
import { BarChart as BarSeries } from "echarts/charts"
import { GridComponent, TooltipComponent } from "echarts/components"
import * as echarts from "echarts/core"

import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import { formatNumber } from "@nhic/currantui-charts/lib/format"
import { partRowColumns } from "@nhic/currantui-charts/lib/table-columns"
import { paletteVar, resolveTokenColor } from "@nhic/currantui-charts/lib/theme"

import type { EChartsCoreOption } from "echarts/core"
import type { ChartBuildContext } from "@nhic/currantui-charts/components/chart-shell"
import type {
  BaseChartOptions,
  PartDataRow,
} from "@nhic/currantui-charts/lib/types"

echarts.use([BarSeries, GridComponent, TooltipComponent])

export interface MeterChartOptions extends BaseChartOptions {
  /** Table/CSV column headers */
  groupLabel?: string
  valueLabel?: string
}

export interface MeterChartProps {
  data: Array<PartDataRow>
  options: MeterChartOptions
  className?: string
}

/**
 * Proportional linear meter: one horizontal bar where each segment's width is
 * its share of the total. A compact alternative to a pie for a single
 * part-to-whole breakdown; defaults to a short 120px body.
 */
function MeterChart({ data, options, className }: MeterChartProps) {
  const buildOption = React.useCallback((context: ChartBuildContext): EChartsCoreOption => {
    const visible = (row: PartDataRow) => !context.hiddenGroups.has(row.group)
    const total = data.reduce(
      (sum, row) => sum + (visible(row) ? row.value : 0),
      0
    )
    const format = options.valueFormatter ?? formatNumber
    return {
      grid: { top: 4, right: 4, bottom: 4, left: 4 },
      tooltip: {
        trigger: "item",
        confine: true,
        formatter: (params: { seriesName?: string; value?: unknown }) => {
          const value = typeof params.value === "number" ? params.value : 0
          const share = total > 0 ? Math.round((value / total) * 100) : 0
          return `${params.seriesName ?? ""}: ${format(value)} (${share}%)`
        },
      },
      xAxis: { type: "value" as const, max: total || 1, show: false },
      yAxis: { type: "category" as const, data: [""], show: false },
      series: data.map((row) => ({
        name: row.group,
        type: "bar" as const,
        stack: "total",
        barWidth: 20,
        // Hairline card-colored borders keep adjacent segments separable
        itemStyle: { borderColor: resolveTokenColor("--card"), borderWidth: 1 },
        data: [visible(row) ? row.value : 0],
      })),
    }
  }, [data, options])

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
      options={{ height: 120, ...options }}
      rows={data}
      tableColumns={tableColumns}
      legendItems={legendItems}
      buildOption={buildOption}
      className={className}
    />
  )
}

export { MeterChart }
