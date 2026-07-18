import * as React from "react"
import { LineChart as LineSeries } from "echarts/charts"
import { GridComponent, TooltipComponent } from "echarts/components"
import * as echarts from "echarts/core"

import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import {
  baseGrid,
  baseTooltip,
  categoryAxis,
  groupsOf,
  keysOf,
  selectionStyle,
  valueAxis,
  valuesByGroup,
} from "@nhic/currantui-charts/lib/option-base"
import { groupedRowColumns } from "@nhic/currantui-charts/lib/table-columns"
import { paletteVar } from "@nhic/currantui-charts/lib/theme"

import type { EChartsCoreOption } from "echarts/core"
import type { ChartBuildContext } from "@nhic/currantui-charts/components/chart-shell"
import type {
  AxisChartOptions,
  ChartDataRow,
  CrossFilterBinding,
} from "@nhic/currantui-charts/lib/types"

echarts.use([LineSeries, GridComponent, TooltipComponent])

export interface LineChartOptions extends AxisChartOptions {
  /** Defaults to "linear" */
  curve?: "linear" | "smooth"
  /** Point markers on each datum; defaults to true */
  points?: boolean
}

export interface LineChartProps {
  data: Array<ChartDataRow>
  options: LineChartOptions
  crossFilter?: CrossFilterBinding
  className?: string
}

function LineChart({ data, options, crossFilter, className }: LineChartProps) {
  const buildOption = React.useCallback((context: ChartBuildContext): EChartsCoreOption => {
    const groups = groupsOf(data)
    const keys = keysOf(data)
    const values = valuesByGroup(data, groups, keys)
    return {
      grid: baseGrid({
        left: Boolean(options.yAxis?.label),
        bottom: Boolean(options.xAxis?.label),
      }),
      tooltip: { trigger: "axis", ...baseTooltip(options.valueFormatter) },
      xAxis: categoryAxis(keys.map(String), options.xAxis),
      yAxis: valueAxis(options.yAxis, options.valueFormatter),
      series: groups.map((group) => {
        // Per-datum symbol dimming for "key" clicks; the whole series (line +
        // symbols) dims for "group" clicks since the stroke isn't per-datum
        const groupDim =
          crossFilter?.on === "group" ? selectionStyle(context.selection, group) : undefined
        return {
          name: group,
          type: "line" as const,
          smooth: options.curve === "smooth",
          showSymbol: options.points !== false,
          symbolSize: 6,
          lineStyle: groupDim,
          // Without symbols, ECharts never dispatches click on the polyline
          // unless triggerEvent is set — only enabled when bound, so unbound
          // charts stay byte-identical (standalone safety)
          ...(crossFilter ? { triggerEvent: true } : {}),
          data: context.hiddenGroups.has(group)
            ? []
            : (values.get(group) ?? []).map((value, index) => ({
                value,
                itemStyle:
                  groupDim ?? selectionStyle(context.selection, keys[index]),
              })),
        }
      }),
    }
  }, [data, options, crossFilter?.on, Boolean(crossFilter)])

  const legendItems = React.useMemo(
    () =>
      groupsOf(data).map((group, index) => ({
        label: group,
        color: paletteVar(index),
      })),
    [data]
  )

  const tableColumns = React.useMemo(
    () =>
      groupedRowColumns({
        key: options.xAxis?.label,
        value: options.yAxis?.label,
      }),
    [options.xAxis, options.yAxis]
  )

  return (
    <ChartShell
      options={options}
      rows={data}
      tableColumns={tableColumns}
      legendItems={legendItems}
      buildOption={buildOption}
      crossFilter={crossFilter}
      className={className}
    />
  )
}

export { LineChart }
