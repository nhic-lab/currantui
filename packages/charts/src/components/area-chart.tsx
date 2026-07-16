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
} from "@nhic/currantui-charts/lib/types"

echarts.use([LineSeries, GridComponent, TooltipComponent])

export interface AreaChartOptions extends AxisChartOptions {
  /** Stack the series into a cumulative total; defaults to false */
  stacked?: boolean
  /** Defaults to "linear" */
  curve?: "linear" | "smooth"
}

export interface AreaChartProps {
  data: Array<ChartDataRow>
  options: AreaChartOptions
  className?: string
}

function AreaChart({ data, options, className }: AreaChartProps) {
  const buildOption = React.useCallback((context: ChartBuildContext): EChartsCoreOption => {
    const groups = groupsOf(data)
    const keys = keysOf(data)
    const values = valuesByGroup(data, groups, keys)
    const stacked = options.stacked === true
    return {
      grid: baseGrid({
        left: Boolean(options.yAxis?.label),
        bottom: Boolean(options.xAxis?.label),
      }),
      tooltip: { trigger: "axis", ...baseTooltip(options.valueFormatter) },
      xAxis: categoryAxis(keys.map(String), options.xAxis),
      yAxis: valueAxis(options.yAxis, options.valueFormatter),
      series: groups.map((group) => ({
        name: group,
        type: "line" as const,
        smooth: options.curve === "smooth",
        showSymbol: false,
        stack: stacked ? "total" : undefined,
        // Stacked fills tile without overlapping, so they can be denser;
        // overlapping fills stay light to keep every series readable
        areaStyle: { opacity: stacked ? 0.5 : 0.2 },
        emphasis: { focus: "series" as const },
        data: context.hiddenGroups.has(group) ? [] : (values.get(group) ?? []),
      })),
    }
  }, [data, options])

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
      className={className}
    />
  )
}

export { AreaChart }
