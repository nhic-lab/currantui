import * as echarts from "echarts/core"

import { expect, waitFor } from "storybook/test"

/*
 * Story-test helpers for driving real clicks on ECharts canvases. This
 * module is test-only: it lives outside the tsup entry globs and the
 * package exports map, so it never reaches dist or consumers.
 */

/**
 * Dispatch real mouse events on the canvas rather than going through
 * userEvent.pointer: synthetic events built by the test runner report
 * offsetX/offsetY as 0, which zrender trusts over clientX/getBoundingClientRect
 * (see zrender/core/event.js clientToLocal), so clicks silently miss every
 * mark. Overriding offsetX/offsetY keeps the click flowing through the real
 * DOM/zrender/echarts pipeline with correct coordinates.
 */
export function clickPixel(host: HTMLElement, x: number, y: number, ctrl = false) {
  const canvasEl = host.querySelector("canvas")!
  const rect = canvasEl.getBoundingClientRect()
  const clientX = rect.left + x
  const clientY = rect.top + y
  for (const type of ["mousedown", "mouseup", "click"]) {
    const event = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      button: 0,
      ctrlKey: ctrl,
    })
    Object.defineProperty(event, "offsetX", { value: x })
    Object.defineProperty(event, "offsetY", { value: y })
    canvasEl.dispatchEvent(event)
  }
}

export function chartHost(chartRoot: Element): HTMLElement {
  return chartRoot.querySelector<HTMLElement>('div[aria-hidden="true"]')!
}

/**
 * Poll the pure coordinate conversion until the chart's coordinate system
 * answers with finite pixels. Right after a selection-triggered
 * setOption(notMerge) rebuild — common on slow CI runners — convertToPixel
 * briefly returns undefined; retrying the conversion is side-effect-free,
 * unlike retrying clicks.
 */
async function resolvePixel(
  host: HTMLElement,
  coords: [number, number]
): Promise<[number, number]> {
  const deadline = Date.now() + 3000
  for (;;) {
    const chart = echarts.getInstanceByDom(host)
    const pixel = chart?.convertToPixel({ seriesIndex: 0 }, coords) as
      | [number, number]
      | undefined
    if (pixel && Number.isFinite(pixel[0]) && Number.isFinite(pixel[1])) {
      return pixel
    }
    if (Date.now() > deadline) {
      throw new Error(
        "convertToPixel produced no finite pixel within 3s — is the chart's coordinate system mounted?"
      )
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}

/** Click the mark for a category via ECharts' own coordinate conversion. */
export async function clickCategory(
  chartRoot: Element,
  categoryIndex: number,
  value: number,
  ctrl = false
) {
  const host = chartHost(chartRoot)
  const [x, y] = await resolvePixel(host, [categoryIndex, value / 2])
  clickPixel(host, x, y, ctrl)
}

/**
 * Click inside a filled area/line polygon between two categories (not on a
 * data-point vertex, which sits on the polygon's own edge and can miss the
 * fill hit-test). Callers must await `settleChart` first — the fill is not
 * hit-testable until the reveal animation completes, and dispatching clicks
 * against a mid-animation chart toggles state unpredictably.
 */
export async function clickAreaFill(
  chartRoot: Element,
  categoryIndex: number,
  belowValue: number
) {
  const host = chartHost(chartRoot)
  const [x0] = await resolvePixel(host, [categoryIndex, 0])
  const [x1] = await resolvePixel(host, [categoryIndex + 1, 0])
  const [, y] = await resolvePixel(host, [categoryIndex, belowValue])
  clickPixel(host, (x0 + x1) / 2, y)
}

/**
 * Resolve once the chart's coordinate system answers convertToPixel and the
 * render/animation pipeline reports finished (bounded fallback in case the
 * "finished" event fired before we could attach).
 */
export async function settleChart(chartRoot: Element) {
  const host = chartHost(chartRoot)
  await waitFor(() => {
    const chart = echarts.getInstanceByDom(host)
    expect(chart).toBeTruthy()
    const pixel = chart!.convertToPixel({ seriesIndex: 0 }, [0, 0])
    expect(Number.isFinite(pixel[0])).toBe(true)
  })
  const chart = echarts.getInstanceByDom(host)!
  await new Promise<void>((resolve) => {
    let settled = false
    const done = () => {
      if (settled) return
      settled = true
      chart.off("finished", done)
      resolve()
    }
    chart.on("finished", done)
    setTimeout(done, 1500)
  })
}

/** Click a map region by geographic coordinate (a point inside the feature). */
export async function clickGeoCoord(
  chartRoot: Element,
  lngLat: [number, number],
  ctrl = false
) {
  const host = chartHost(chartRoot)
  const pixel = await resolvePixel(host, lngLat)
  clickPixel(host, pixel[0], pixel[1], ctrl)
}
