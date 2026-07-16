import * as React from "react"
import { PieChart as PieSeries } from "echarts/charts"
import { TooltipComponent } from "echarts/components"
import * as echarts from "echarts/core"

import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import { baseTooltip } from "@nhic/currantui-charts/lib/option-base"
import { partRowColumns } from "@nhic/currantui-charts/lib/table-columns"
import { paletteVar } from "@nhic/currantui-charts/lib/theme"

import type { EChartsCoreOption } from "echarts/core"
import type {
  BaseChartOptions,
  PartDataRow,
} from "@nhic/currantui-charts/lib/types"

echarts.use([PieSeries, TooltipComponent])

export interface DonutChartOptions extends BaseChartOptions {
  /** HTML label centered in the ring — crisp, token-themed, and readable by assistive tech */
  centerLabel?: {
    value?: string
    caption?: string
  }
  /** Table/CSV column headers */
  groupLabel?: string
  valueLabel?: string
}

export interface DonutChartProps {
  data: Array<PartDataRow>
  options: DonutChartOptions
  className?: string
}

function DonutChart({ data, options, className }: DonutChartProps) {
  const buildOption = React.useCallback(
    (): EChartsCoreOption => ({
      tooltip: { trigger: "item", ...baseTooltip(options.valueFormatter) },
      series: [
        {
          type: "pie" as const,
          radius: ["55%", "75%"],
          label: { show: false },
          labelLine: { show: false },
          data: data.map((row) => ({ name: row.group, value: row.value })),
        },
      ],
    }),
    [data, options]
  )

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

  const centerLabel = options.centerLabel
  const overlay = centerLabel ? (
    <>
      {centerLabel.value && (
        <div
          data-slot="chart-center-value"
          className="font-heading text-xl font-semibold text-foreground tabular-nums"
        >
          {centerLabel.value}
        </div>
      )}
      {centerLabel.caption && (
        <div
          data-slot="chart-center-caption"
          className="text-xs/relaxed text-muted-foreground"
        >
          {centerLabel.caption}
        </div>
      )}
    </>
  ) : undefined

  return (
    <ChartShell
      options={options}
      rows={data}
      tableColumns={tableColumns}
      legendItems={legendItems}
      buildOption={buildOption}
      overlay={overlay}
      className={className}
    />
  )
}

export { DonutChart }
