import * as React from "react"
import { MapChart as MapSeries } from "echarts/charts"
import { TooltipComponent, VisualMapComponent } from "echarts/components"
import * as echarts from "echarts/core"

import { isGeoMapRegistered } from "@nhic/currantui-charts/lib/geo"
import { ChartRampLegend } from "@nhic/currantui-charts/components/chart-ramp-legend"
import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import { formatNumber } from "@nhic/currantui-charts/lib/format"
import { baseTooltip, selectionStyle } from "@nhic/currantui-charts/lib/option-base"
import { resolveTokenColor } from "@nhic/currantui-charts/lib/theme"

import type { EChartsCoreOption } from "echarts/core"
import type { ChartBuildContext } from "@nhic/currantui-charts/components/chart-shell"
import type { ChartTableColumn } from "@nhic/currantui-charts/lib/table-columns"
import type {
  BaseChartOptions,
  CrossFilterBinding,
} from "@nhic/currantui-charts/lib/types"

echarts.use([MapSeries, TooltipComponent, VisualMapComponent])

declare const process: { env: { NODE_ENV?: string } }

export interface ChoroplethDataRow {
  /** Must match the GeoJSON feature's `properties.name` */
  region: string
  value: number
}

export interface ChoroplethChartOptions extends BaseChartOptions {
  /** Name previously passed to registerGeoMap */
  map: string
  /** Visual-map bounds; default to the data extent */
  min?: number
  max?: number
}

export interface ChoroplethChartProps {
  data: Array<ChoroplethDataRow>
  options: ChoroplethChartOptions
  /** Region name is the selection value; `on` is ignored (regions have no group axis) */
  crossFilter?: CrossFilterBinding
  className?: string
}

function ChoroplethChart({ data, options, crossFilter, className }: ChoroplethChartProps) {
  const mapReady = isGeoMapRegistered(options.map)
  const format = options.valueFormatter ?? formatNumber

  const warnedRef = React.useRef(false)
  React.useEffect(() => {
    if (!mapReady && !warnedRef.current && process.env.NODE_ENV !== "production") {
      warnedRef.current = true
      console.error(
        `ChoroplethChart: map "${options.map}" is not registered; call registerGeoMap(name, geoJson) before rendering. Rendering the empty state instead.`
      )
    }
  }, [mapReady, options.map])

  const domain = React.useMemo(() => {
    const values = data.map((row) => row.value)
    return {
      min: options.min ?? (values.length ? Math.min(...values) : 0),
      max: options.max ?? (values.length ? Math.max(...values) : 0),
    }
  }, [data, options.min, options.max])

  const buildOption = React.useCallback(
    (context: ChartBuildContext): EChartsCoreOption => ({
      tooltip: {
        trigger: "item",
        ...baseTooltip(options.valueFormatter),
        formatter: (params: { name?: string; value?: unknown }) =>
          `${String(params.name ?? "")}: ${
            typeof params.value === "number" && Number.isFinite(params.value)
              ? format(params.value)
              : "No data"
          }`,
      },
      visualMap: {
        type: "continuous",
        show: false,
        min: domain.min,
        max: domain.max,
        inRange: {
          color: [resolveTokenColor("--chart-2", 0.12), resolveTokenColor("--chart-2")],
        },
      },
      series: [
        {
          type: "map" as const,
          map: options.map,
          roam: false,
          label: { show: false },
          itemStyle: {
            borderColor: resolveTokenColor("--card"),
            areaColor: resolveTokenColor("--muted"),
          },
          emphasis: {
            label: { show: false },
            itemStyle: { areaColor: resolveTokenColor("--chart-2", 0.6) },
          },
          data: data.map((row) => ({
            name: row.region,
            value: row.value,
            itemStyle: selectionStyle(context.selection, row.region),
          })),
        },
      ],
    }),
    [data, domain, format, options]
  )

  const tableColumns = React.useMemo(
    (): Array<ChartTableColumn<ChoroplethDataRow>> => [
      { header: "Region", value: (row) => row.region },
      { header: "Value", value: (row) => row.value },
    ],
    []
  )

  return (
    <ChartShell
      options={options}
      rows={mapReady ? data : []}
      tableColumns={tableColumns}
      legendContent={
        data.length > 0 && mapReady ? (
          <ChartRampLegend minLabel={format(domain.min)} maxLabel={format(domain.max)} />
        ) : undefined
      }
      buildOption={buildOption}
      crossFilter={crossFilter}
      filterValueFrom={(params) => params.name}
      className={className}
    />
  )
}

export { ChoroplethChart }
