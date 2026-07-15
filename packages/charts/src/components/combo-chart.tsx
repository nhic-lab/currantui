import * as React from "react"
import { BarChart as BarSeries, LineChart as LineSeries } from "echarts/charts"
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

echarts.use([BarSeries, LineSeries, GridComponent, TooltipComponent])

export interface ComboChartOptions extends AxisChartOptions {
  /** Mark type per group; groups not listed render as bars */
  seriesTypes?: Record<string, "bar" | "line">
  /**
   * Second value axis on the right for groups whose scale differs from the
   * rest (e.g. a rate over counts). Prefer a single axis whenever the series
   * share a scale — two axes are harder to read.
   */
  secondaryYAxis?: {
    groups: Array<string>
    label?: string
    formatter?: (value: number) => string
  }
}

export interface ComboChartProps {
  data: Array<ChartDataRow>
  options: ComboChartOptions
  className?: string
}

function ComboChart({ data, options, className }: ComboChartProps) {
  const buildOption = React.useCallback((): EChartsCoreOption => {
    const groups = groupsOf(data)
    const keys = keysOf(data)
    const values = valuesByGroup(data, groups, keys)
    const secondary = options.secondaryYAxis
    const primaryAxis = valueAxis(options.yAxis, options.valueFormatter)
    return {
      grid: baseGrid({
        left: Boolean(options.yAxis?.label),
        bottom: Boolean(options.xAxis?.label),
        right: Boolean(secondary?.label),
      }),
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        ...baseTooltip(options.valueFormatter),
      },
      xAxis: categoryAxis(keys.map(String), options.xAxis),
      yAxis: secondary
        ? [
            primaryAxis,
            {
              ...valueAxis(
                { label: secondary.label, formatter: secondary.formatter },
                options.valueFormatter
              ),
              // One grid: the primary axis owns the split lines
              splitLine: { show: false },
            },
          ]
        : primaryAxis,
      series: groups.map((group) => {
        const type = options.seriesTypes?.[group] ?? "bar"
        const base = {
          name: group,
          data: values.get(group) ?? [],
          yAxisIndex: secondary?.groups.includes(group) ? 1 : 0,
        }
        return type === "line"
          ? { ...base, type: "line" as const, showSymbol: true, symbolSize: 6 }
          : { ...base, type: "bar" as const, barMaxWidth: 48 }
      }),
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
        // With a second axis the groups measure different things, so the
        // primary axis label would mislabel the secondary group's values
        value: options.secondaryYAxis ? undefined : options.yAxis?.label,
      }),
    [options.xAxis, options.yAxis, options.secondaryYAxis]
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

export { ComboChart }
