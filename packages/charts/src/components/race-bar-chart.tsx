import * as React from "react"
import { PauseIcon, PlayIcon } from "@phosphor-icons/react"
import { BarChart as BarSeries } from "echarts/charts"
import { GridComponent, TooltipComponent } from "echarts/components"
import * as echarts from "echarts/core"

import { Button } from "@nhic/currantui/components/button"
import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import { formatNumber } from "@nhic/currantui-charts/lib/format"
import {
  baseGrid,
  baseTooltip,
  groupsOf,
  keysOf,
  valueAxis,
  valuesByGroup,
} from "@nhic/currantui-charts/lib/option-base"
import { groupedRowColumns } from "@nhic/currantui-charts/lib/table-columns"

import type { EChartsCoreOption, EChartsType } from "echarts/core"
import type {
  AxisChartOptions,
  ChartDataRow,
} from "@nhic/currantui-charts/lib/types"

echarts.use([BarSeries, GridComponent, TooltipComponent])

export interface RaceBarChartOptions extends AxisChartOptions {
  /** Show only the largest N bars per frame */
  topN?: number
  /** Milliseconds per frame; defaults to 1200 */
  frameDurationMs?: number
  /** Start playing on mount; defaults to true */
  autoplay?: boolean
  /** Restart from the first frame after the last; defaults to true */
  loop?: boolean
  /** Table/CSV column header for the frame column */
  frameLabel?: string
}

export interface RaceBarChartProps {
  /** `key` is the animation frame (e.g. a year), in order of first appearance */
  data: Array<ChartDataRow>
  options: RaceBarChartOptions
  className?: string
}

/**
 * Animated bar race: horizontal bars re-rank as the animation steps through
 * the frames in `key` order. Frames advance by merging new values into the
 * live canvas so the renderer animates the re-sorting; colors are assigned
 * per group and stay bound to it across frames. The table view and CSV
 * export carry every frame's rows.
 */
function RaceBarChart({ data, options, className }: RaceBarChartProps) {
  const { frameDurationMs = 1200, autoplay = true, loop = true } = options
  const frames = React.useMemo(() => keysOf(data), [data])
  const groups = React.useMemo(() => groupsOf(data), [data])
  const values = React.useMemo(
    () => valuesByGroup(data, groups, frames),
    [data, groups, frames]
  )

  const [frameIndex, setFrameIndex] = React.useState(0)
  const [playing, setPlaying] = React.useState(autoplay)
  const frameIndexRef = React.useRef(frameIndex)
  frameIndexRef.current = frameIndex
  const instancesRef = React.useRef(new Set<EChartsType>())

  const frameValues = React.useCallback(
    (index: number) => groups.map((group) => values.get(group)?.[index] ?? null),
    [groups, values]
  )

  const buildOption = React.useCallback((): EChartsCoreOption => {
    return {
      grid: baseGrid({ bottom: Boolean(options.xAxis?.label) }),
      tooltip: {
        trigger: "item",
        ...baseTooltip(options.valueFormatter),
      },
      xAxis: {
        ...valueAxis(options.xAxis, options.valueFormatter),
        nameGap: 28,
      },
      yAxis: {
        type: "category" as const,
        data: [...groups],
        inverse: true,
        max: options.topN !== undefined ? options.topN - 1 : undefined,
        animationDuration: 300,
        animationDurationUpdate: 300,
      },
      animationDurationUpdate: frameDurationMs,
      animationEasingUpdate: "linear" as const,
      series: [
        {
          type: "bar" as const,
          realtimeSort: true,
          colorBy: "data" as const,
          barMaxWidth: 24,
          label: {
            show: true,
            position: "right" as const,
            valueAnimation: true,
            formatter: (params: { value?: unknown }) =>
              typeof params.value === "number"
                ? (options.valueFormatter ?? formatNumber)(params.value)
                : "",
          },
          data: frameValues(frameIndexRef.current),
        },
      ],
    }
  }, [groups, frameValues, frameDurationMs, options])

  // Frames merge into the live instances so the renderer animates re-sorting;
  // a declarative rebuild (notMerge) would repaint without transitions
  const handleInstance = React.useCallback((chart: EChartsType | null) => {
    if (chart) instancesRef.current.add(chart)
    instancesRef.current.forEach((instance) => {
      if (instance.isDisposed()) instancesRef.current.delete(instance)
    })
  }, [])

  React.useEffect(() => {
    const series = [{ data: frameValues(frameIndex) }]
    instancesRef.current.forEach((instance) => {
      if (!instance.isDisposed()) instance.setOption({ series })
    })
  }, [frameIndex, frameValues])

  React.useEffect(() => {
    if (!playing || frames.length < 2) return
    const timer = setInterval(() => {
      setFrameIndex((index) => {
        if (index + 1 < frames.length) return index + 1
        if (loop) return 0
        setPlaying(false)
        return index
      })
    }, frameDurationMs)
    return () => clearInterval(timer)
  }, [playing, frames.length, frameDurationMs, loop])

  const tableColumns = React.useMemo(
    () =>
      groupedRowColumns({
        key: options.frameLabel,
        value: options.xAxis?.label,
      }),
    [options.frameLabel, options.xAxis]
  )

  const frameKey = frames.length > 0 ? frames[frameIndex] : undefined
  const overlay =
    frameKey === undefined ? undefined : (
      <div
        data-slot="chart-race-frame"
        className="absolute right-2 bottom-1 font-heading text-3xl font-semibold text-muted-foreground/40 tabular-nums"
      >
        {frameKey}
      </div>
    )

  return (
    <ChartShell
      options={options}
      rows={data}
      tableColumns={tableColumns}
      buildOption={buildOption}
      overlay={overlay}
      onCanvasInstance={handleInstance}
      legendContent={
        <div
          data-slot="chart-race-controls"
          className="flex items-center gap-2 text-sm/relaxed text-muted-foreground tabular-nums"
        >
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={playing ? "Pause animation" : "Play animation"}
            onClick={() => setPlaying((current) => !current)}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </Button>
          <span>
            {String(frameKey ?? "")} · {frameIndex + 1}/{frames.length}
          </span>
        </div>
      }
      className={className}
    />
  )
}

export { RaceBarChart }
