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
  crossFilter?: CrossFilterBinding
  className?: string
}

function ComboChart({ data, options, crossFilter, className }: ComboChartProps) {
  const buildOption = React.useCallback((context: ChartBuildContext): EChartsCoreOption => {
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
        // Per-datum dimming for "key" clicks; a line's stroke is series-level
        // so "group" clicks additionally dim the whole line via lineStyle
        const groupDim =
          crossFilter?.on === "group" ? selectionStyle(context.selection, group) : undefined
        const base = {
          name: group,
          data: context.hiddenGroups.has(group)
            ? []
            : (values.get(group) ?? []).map((value, index) => ({
                value,
                itemStyle:
                  groupDim ?? selectionStyle(context.selection, keys[index]),
              })),
          yAxisIndex: secondary?.groups.includes(group) ? 1 : 0,
        }
        return type === "line"
          ? { ...base, type: "line" as const, showSymbol: true, symbolSize: 6, lineStyle: groupDim }
          : { ...base, type: "bar" as const, barMaxWidth: 48 }
      }),
    }
  }, [data, options, crossFilter?.on])

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
      crossFilter={crossFilter}
      className={className}
    />
  )
}

export { ComboChart }
