import * as React from "react"
import { BarChart as BarSeries } from "echarts/charts"
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

echarts.use([BarSeries, GridComponent, TooltipComponent])

export interface BarChartOptions extends AxisChartOptions {
  /** Defaults to "vertical" */
  orientation?: "vertical" | "horizontal"
  /** Defaults to "grouped" */
  mode?: "grouped" | "stacked"
}

export interface BarChartProps {
  data: Array<ChartDataRow>
  options: BarChartOptions
  crossFilter?: CrossFilterBinding
  className?: string
}

function BarChart({ data, options, crossFilter, className }: BarChartProps) {
  const vertical = options.orientation !== "horizontal"

  const buildOption = React.useCallback((context: ChartBuildContext): EChartsCoreOption => {
    const groups = groupsOf(data)
    const keys = keysOf(data)
    const values = valuesByGroup(data, groups, keys)
    const stacked = options.mode === "stacked"
    const domainAxis = categoryAxis(
      keys.map(String),
      vertical ? options.xAxis : options.yAxis
    )
    const measureAxis = valueAxis(
      vertical ? options.yAxis : options.xAxis,
      options.valueFormatter
    )
    return {
      grid: baseGrid({
        left: Boolean(options.yAxis?.label),
        bottom: Boolean(options.xAxis?.label),
      }),
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        ...baseTooltip(options.valueFormatter),
      },
      xAxis: vertical ? domainAxis : measureAxis,
      yAxis: vertical ? measureAxis : domainAxis,
      // Hidden groups keep their series slot (empty data) so colors stay
      // bound to their group instead of shifting onto the survivors
      series: groups.map((group) => ({
        name: group,
        type: "bar" as const,
        stack: stacked ? "total" : undefined,
        data: context.hiddenGroups.has(group)
          ? []
          : (values.get(group) ?? []).map((value, index) => ({
              value,
              itemStyle: selectionStyle(
                context.selection,
                crossFilter?.on === "group" ? group : keys[index]
              ),
            })),
        barMaxWidth: 48,
      })),
    }
  }, [data, options, vertical, crossFilter?.on])

  const legendItems = React.useMemo(
    () =>
      groupsOf(data).map((group, index) => ({
        label: group,
        color: paletteVar(index),
      })),
    [data]
  )

  const tableColumns = React.useMemo(() => {
    const domain = vertical ? options.xAxis : options.yAxis
    const measure = vertical ? options.yAxis : options.xAxis
    return groupedRowColumns({ key: domain?.label, value: measure?.label })
  }, [options.xAxis, options.yAxis, vertical])

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

export { BarChart }
