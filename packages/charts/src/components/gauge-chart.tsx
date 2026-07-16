import * as React from "react"
import { GaugeChart as GaugeSeries } from "echarts/charts"
import * as echarts from "echarts/core"

import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import { formatNumber } from "@nhic/currantui-charts/lib/format"
import { resolveTokenColor } from "@nhic/currantui-charts/lib/theme"

import type { EChartsCoreOption } from "echarts/core"
import type { ChartTableColumn } from "@nhic/currantui-charts/lib/table-columns"
import type {
  BaseChartOptions,
  GaugeDataRow,
} from "@nhic/currantui-charts/lib/types"

echarts.use([GaugeSeries])

export type GaugeTone = "success" | "warning" | "destructive"

export interface GaugeChartOptions extends BaseChartOptions {
  /** Defaults to 0 */
  min?: number
  /** Defaults to 100 */
  max?: number
  /**
   * Zone boundaries in ascending order; each zone up to `upTo` is tinted with
   * its status tone and the progress arc takes the tone of the current zone
   */
  thresholds?: Array<{ upTo: number; tone: GaugeTone }>
  /** Caption under the centered value */
  caption?: string
  /** Table/CSV column header */
  valueLabel?: string
}

export interface GaugeChartProps {
  data: Array<GaugeDataRow>
  options: GaugeChartOptions
  className?: string
}

const TONE_TOKEN: Record<GaugeTone, string> = {
  success: "--success",
  warning: "--warning",
  destructive: "--destructive",
}

function GaugeChart({ data, options, className }: GaugeChartProps) {
  const value = data.length > 0 ? data[0].value : undefined
  const { min = 0, max = 100, thresholds } = options

  const buildOption = React.useCallback((): EChartsCoreOption => {
    const span = max - min || 1
    // Soft zone tints keep the full-strength progress arc distinguishable
    const zones: Array<[number, string]> = thresholds?.length
      ? thresholds.map((zone) => [
          Math.min(1, Math.max(0, (zone.upTo - min) / span)),
          resolveTokenColor(TONE_TOKEN[zone.tone], 0.25),
        ])
      : [[1, resolveTokenColor("--muted")]]
    const lastZone = zones[zones.length - 1]
    if (lastZone[0] < 1) {
      zones.push([1, resolveTokenColor("--muted")])
    }
    const currentTone = thresholds?.find((zone) => (value ?? min) <= zone.upTo)
    return {
      series: [
        {
          type: "gauge" as const,
          startAngle: 225,
          endAngle: -45,
          min,
          max,
          // The zones tint a slim track; the progress arc carries the value
          axisLine: { lineStyle: { width: 12, color: zones } },
          progress: {
            show: true,
            width: 12,
            itemStyle: currentTone
              ? { color: resolveTokenColor(TONE_TOKEN[currentTone.tone]) }
              : undefined,
          },
          pointer: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: { show: false },
          data: [{ value: value ?? min }],
        },
      ],
    }
  }, [value, min, max, thresholds])

  const tableColumns = React.useMemo(
    (): Array<ChartTableColumn<GaugeDataRow>> => [
      {
        header: options.valueLabel ?? "Value",
        value: (row) => row.value,
      },
    ],
    [options.valueLabel]
  )

  const format = options.valueFormatter ?? formatNumber
  const overlay =
    value === undefined ? undefined : (
      <>
        <div
          data-slot="chart-center-value"
          className="font-heading text-2xl font-semibold text-foreground tabular-nums"
        >
          {format(value)}
        </div>
        {options.caption && (
          <div
            data-slot="chart-center-caption"
            className="text-xs/relaxed text-muted-foreground"
          >
            {options.caption}
          </div>
        )}
      </>
    )

  return (
    <ChartShell
      options={options}
      rows={data}
      tableColumns={tableColumns}
      buildOption={buildOption}
      overlay={overlay}
      className={className}
    />
  )
}

export { GaugeChart }
