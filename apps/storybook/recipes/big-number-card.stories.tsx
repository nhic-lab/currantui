/**
 * Recipe: Big Number Card
 *
 * Copy-paste dashboard stat card: a flat headline number over a soft
 * primary-gradient trendline, in the standard bordered Card shell. The
 * sparkline is a raw echarts line via `useEChart` — no axes, no chrome —
 * so the number stays the star.
 */
import * as React from "react"
import { LineChart as LineSeries } from "echarts/charts"
import { GridComponent } from "echarts/components"
import * as echarts from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"

import { Card, CardContent } from "@nhic/currantui/components/card"
import { resolveTokenColor } from "@nhic/currantui-charts/lib/theme"
import { useEChart } from "@nhic/currantui-charts/lib/use-echart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { EChartsCoreOption } from "echarts/core"

echarts.use([LineSeries, GridComponent, CanvasRenderer])

interface BigNumberCardProps {
  title: string
  value: number
  subheader?: string
  trend?: Array<number>
}

function BigNumberCard({ title, value, subheader, trend }: BigNumberCardProps) {
  const buildOption = React.useCallback(
    (): EChartsCoreOption => ({
      grid: { top: 4, bottom: 0, left: 0, right: 0 },
      xAxis: { type: "category", show: false, boundaryGap: false },
      yAxis: { type: "value", show: false, min: "dataMin" },
      series: [
        {
          type: "line",
          data: trend ?? [],
          smooth: true,
          symbol: "none",
          silent: true,
          lineStyle: { width: 2, color: resolveTokenColor("--primary") },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: resolveTokenColor("--primary", 0.35) },
                { offset: 1, color: resolveTokenColor("--primary", 0) },
              ],
            },
          },
        },
      ],
    }),
    [trend]
  )
  const { containerRef } = useEChart(buildOption)

  return (
    <Card className="w-72">
      <CardContent>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="mt-1 text-4xl font-medium leading-tight tabular-nums">
          {new Intl.NumberFormat("en").format(value)}
        </div>
        {subheader && (
          <div className="mt-1 text-xs text-muted-foreground">{subheader}</div>
        )}
        {trend && trend.length > 1 && (
          <div ref={containerRef} className="mt-2 h-16 w-full" />
        )}
      </CardContent>
    </Card>
  )
}

const meta = {
  title: "Recipes/BigNumberCard",
  component: BigNumberCard,
  parameters: { layout: "centered" },
} satisfies Meta<typeof BigNumberCard>

export default meta
type Story = StoryObj<typeof meta>

export const BirthsRegistered: Story = {
  args: {
    title: "Births registered",
    value: 12480,
    subheader: "March 2026 · all districts",
    trend: [820, 910, 1040, 980, 1150, 1230, 1180, 1310, 1420, 1390, 1480, 1560],
  },
}

export const WithoutTrend: Story = {
  args: {
    title: "Facilities reporting",
    value: 486,
    subheader: "of 512 registered facilities",
  },
}
