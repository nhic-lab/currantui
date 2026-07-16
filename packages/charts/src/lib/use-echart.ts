import * as React from "react"
import * as echarts from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"

import { buildChartTheme } from "@nhic/currantui-charts/lib/theme"

import type { EChartsCoreOption, EChartsType } from "echarts/core"

echarts.use([CanvasRenderer])

export interface ImageExportOptions {
  type: "png" | "jpeg"
  pixelRatio: number
  backgroundColor: string
}

export interface UseEChartResult {
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Live chart instance; null before mount */
  chartRef: React.RefObject<EChartsType | null>
  /** Snapshot of the rendered chart for image export; undefined before mount */
  getDataURL: (options: ImageExportOptions) => string | undefined
}

/**
 * Owns one ECharts instance on the returned container: init with the
 * token-driven theme (canvas renderer, required for image export), resize via
 * ResizeObserver, and re-init when the `.dark` class toggles — ECharts themes
 * are fixed at init, so a fresh init is the reliable re-theme path.
 *
 * Takes the option BUILDER, not the option: builders resolve design tokens
 * (via resolveTokenColor), so the option must be rebuilt on every theme
 * re-init or it would carry colors baked under the previous theme.
 */
export function useEChart(build: () => EChartsCoreOption): UseEChartResult {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const chartRef = React.useRef<EChartsType | null>(null)
  const buildRef = React.useRef(build)
  buildRef.current = build

  React.useLayoutEffect(() => {
    const host = containerRef.current
    if (!host) return

    const create = () => {
      chartRef.current?.dispose()
      const chart = echarts.init(host, buildChartTheme(), { renderer: "canvas" })
      chart.setOption(buildRef.current(), { notMerge: true })
      chartRef.current = chart
    }
    create()

    let frame = 0
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => chartRef.current?.resize())
    })
    resizeObserver.observe(host)

    let dark = document.documentElement.classList.contains("dark")
    const themeObserver = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains("dark")
      if (nowDark === dark) return
      dark = nowDark
      create()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      resizeObserver.disconnect()
      themeObserver.disconnect()
      cancelAnimationFrame(frame)
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [])

  React.useEffect(() => {
    chartRef.current?.setOption(build(), { notMerge: true, lazyUpdate: true })
  }, [build])

  const getDataURL = React.useCallback(
    (options: ImageExportOptions) => chartRef.current?.getDataURL(options),
    []
  )

  return { containerRef, chartRef, getDataURL }
}
