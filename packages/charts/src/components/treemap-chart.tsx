import * as React from "react"
import { TreemapChart as TreemapSeries } from "echarts/charts"
import { TooltipComponent } from "echarts/components"
import * as echarts from "echarts/core"

import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import { formatNumber } from "@nhic/currantui-charts/lib/format"
import { paletteVar, resolveTokenColor } from "@nhic/currantui-charts/lib/theme"

import type { EChartsCoreOption } from "echarts/core"
import type { ChartTableColumn } from "@nhic/currantui-charts/lib/table-columns"
import type {
  BaseChartOptions,
  TreemapNode,
} from "@nhic/currantui-charts/lib/types"

echarts.use([TreemapSeries, TooltipComponent])

export interface TreemapChartOptions extends BaseChartOptions {
  /** Table/CSV column headers */
  nameLabel?: string
  valueLabel?: string
}

export interface TreemapChartProps {
  data: Array<TreemapNode>
  options: TreemapChartOptions
  className?: string
}

interface FlatNode {
  /** Slash-joined ancestry, e.g. "Malaria / Vector control" */
  path: string
  value: number
}

function nodeValue(node: TreemapNode): number {
  return (
    node.value ??
    (node.children ?? []).reduce((sum, child) => sum + nodeValue(child), 0)
  )
}

function flattenNodes(
  nodes: ReadonlyArray<TreemapNode>,
  prefix = ""
): Array<FlatNode> {
  return nodes.flatMap((node) => {
    const path = prefix ? `${prefix} / ${node.name}` : node.name
    return [
      { path, value: nodeValue(node) },
      ...flattenNodes(node.children ?? [], path),
    ]
  })
}

function TreemapChart({ data, options, className }: TreemapChartProps) {
  const format = options.valueFormatter ?? formatNumber
  const flat = React.useMemo(() => flattenNodes(data), [data])

  const buildOption = React.useCallback(
    (): EChartsCoreOption => ({
      tooltip: {
        trigger: "item",
        confine: true,
        formatter: (params: { name?: string; value?: unknown }) =>
          `${params.name ?? ""}: ${format(Number(params.value ?? 0))}`,
      },
      series: [
        {
          type: "treemap" as const,
          // Drill-down stays (click a branch); the canvas-only breadcrumb
          // trail is hidden because it is unreachable for assistive tech
          breadcrumb: { show: false },
          roam: false,
          width: "100%",
          height: "100%",
          itemStyle: {
            borderColor: resolveTokenColor("--card"),
            borderWidth: 1,
            gapWidth: 2,
          },
          data: [...data],
        },
      ],
    }),
    [data, format]
  )

  const legendItems = React.useMemo(
    () =>
      data.map((node, index) => ({
        label: node.name,
        color: paletteVar(index),
      })),
    [data]
  )

  const tableColumns = React.useMemo(
    (): Array<ChartTableColumn<FlatNode>> => [
      { header: options.nameLabel ?? "Name", value: (row) => row.path },
      { header: options.valueLabel ?? "Value", value: (row) => row.value },
    ],
    [options.nameLabel, options.valueLabel]
  )

  return (
    <ChartShell
      options={options}
      rows={flat}
      tableColumns={tableColumns}
      legendItems={legendItems}
      buildOption={buildOption}
      className={className}
    />
  )
}

export { TreemapChart }
