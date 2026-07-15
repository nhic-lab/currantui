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
  valueAxis,
  valuesByGroup,
} from "@nhic/currantui-charts/lib/option-base"
import { groupedRowColumns } from "@nhic/currantui-charts/lib/table-columns"
import { paletteVar } from "@nhic/currantui-charts/lib/theme"

import type { EChartsCoreOption } from "echarts/core"
import type {
  AxisChartOptions,
  ChartDataRow,
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
  className?: string
}

function BarChart({ data, options, className }: BarChartProps) {
  const vertical = options.orientation !== "horizontal"

  const buildOption = React.useCallback((): EChartsCoreOption => {
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
      series: groups.map((group) => ({
        name: group,
        type: "bar" as const,
        stack: stacked ? "total" : undefined,
        data: values.get(group) ?? [],
        barMaxWidth: 48,
      })),
    }
  }, [data, options, vertical])

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
      className={className}
    />
  )
}

export { BarChart }
