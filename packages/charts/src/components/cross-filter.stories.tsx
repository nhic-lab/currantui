import * as React from "react"
import * as echarts from "echarts/core"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { AreaChart } from "@nhic/currantui-charts/components/area-chart"
import { CrossFilterBar, CrossFilterProvider } from "@nhic/currantui-charts/components/cross-filter"
import { BarChart } from "@nhic/currantui-charts/components/bar-chart"
import { PieChart } from "@nhic/currantui-charts/components/pie-chart"

import type { CrossFilterSelection } from "@nhic/currantui-charts/lib/cross-filter"
import type { Meta, StoryObj } from "@storybook/react-vite"

const admissions = [
  { group: "Admissions", key: "Gasabo", value: 840 },
  { group: "Admissions", key: "Kicukiro", value: 720 },
  { group: "Admissions", key: "Musanze", value: 610 },
]

const referrals = [
  { group: "Referrals", key: "Gasabo", value: 120 },
  { group: "Referrals", key: "Kicukiro", value: 90 },
  { group: "Referrals", key: "Musanze", value: 150 },
]

const districts = [
  { group: "Gasabo", value: 840 },
  { group: "Kicukiro", value: 720 },
]

const enrollment = [
  { group: "Enrollment", key: "Q1", value: 840 },
  { group: "Enrollment", key: "Q2", value: 720 },
  { group: "Enrollment", key: "Q3", value: 610 },
]

const meta = {
  title: "Charts/CrossFilter",
  component: CrossFilterProvider,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CrossFilterProvider>

export default meta
type Story = StoryObj<typeof meta>

/*
 * Stateful stories render through wrapper components, which Storybook's
 * "Show code" cannot expand — each one carries an explicit, copyable
 * docs.source snippet instead (test readouts omitted).
 */
const linkedBarsSource = `
function LinkedDistricts() {
  const [selections, setSelections] = React.useState<Array<CrossFilterSelection>>([])
  return (
    <CrossFilterProvider selections={selections} onSelectionsChange={setSelections}>
      <div className="grid grid-cols-2 gap-4">
        <BarChart
          data={admissions}
          options={{ title: "Admissions by district", height: 240 }}
          crossFilter={{ dimension: "district" }}
        />
        <BarChart
          data={referrals}
          options={{ title: "Referrals by district", height: 240 }}
          crossFilter={{ dimension: "district" }}
        />
      </div>
      <CrossFilterBar className="mt-3" labels={{ district: "District" }} />
    </CrossFilterProvider>
  )
}
`.trim()

const linkedMixedSource = `
function LinkedMixed() {
  const [selections, setSelections] = React.useState<Array<CrossFilterSelection>>([])
  return (
    <CrossFilterProvider selections={selections} onSelectionsChange={setSelections}>
      <div className="grid grid-cols-2 gap-4">
        <BarChart
          data={admissions}
          options={{ title: "Admissions by district", height: 240 }}
          crossFilter={{ dimension: "district" }}
        />
        <PieChart
          data={districts}
          options={{ title: "Share by district", height: 240 }}
          crossFilter={{ dimension: "district" }}
        />
      </div>
      <CrossFilterBar className="mt-3" labels={{ district: "District" }} />
    </CrossFilterProvider>
  )
}
`.trim()

const linkedAreaSource = `
function LinkedEnrollment() {
  const [selections, setSelections] = React.useState<Array<CrossFilterSelection>>([])
  return (
    <CrossFilterProvider selections={selections} onSelectionsChange={setSelections}>
      <AreaChart
        data={enrollment}
        options={{ title: "Enrollment trend", height: 240 }}
        crossFilter={{ dimension: "district", on: "group" }}
      />
    </CrossFilterProvider>
  )
}
`.trim()

function LinkedBars() {
  const [selections, setSelections] = React.useState<Array<CrossFilterSelection>>([])
  return (
    <CrossFilterProvider selections={selections} onSelectionsChange={setSelections}>
      <div className="grid max-w-3xl grid-cols-2 gap-4">
        <BarChart
          data={admissions}
          options={{ title: "Admissions by district", height: 240 }}
          crossFilter={{ dimension: "district" }}
        />
        <BarChart
          data={referrals}
          options={{ title: "Referrals by district", height: 240 }}
          crossFilter={{ dimension: "district" }}
        />
      </div>
      <CrossFilterBar className="mt-3" labels={{ district: "District" }} />
      <pre data-testid="selections-readout" className="mt-4 text-xs text-muted-foreground">
        {JSON.stringify(selections)}
      </pre>
    </CrossFilterProvider>
  )
}

/**
 * Click the mark for a category via ECharts' own coordinate conversion.
 * Dispatches real mouse events on the canvas rather than going through
 * userEvent.pointer: synthetic events built by the test runner report
 * offsetX/offsetY as 0, which zrender trusts over clientX/getBoundingClientRect
 * (see zrender/core/event.js clientToLocal), so clicks silently miss every
 * mark. Overriding offsetX/offsetY on the dispatched events keeps the click
 * flowing through the real DOM/zrender/echarts pipeline with correct coordinates.
 */
function clickPixel(host: HTMLElement, x: number, y: number, ctrl = false) {
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

function clickCategory(
  chartRoot: Element,
  categoryIndex: number,
  value: number,
  ctrl = false
) {
  const host = chartRoot.querySelector<HTMLElement>('div[aria-hidden="true"]')!
  const chart = echarts.getInstanceByDom(host)!
  const [x, y] = chart.convertToPixel({ seriesIndex: 0 }, [categoryIndex, value / 2])
  clickPixel(host, x, y, ctrl)
}

/**
 * Click inside a filled area/line polygon between two categories (not on a
 * data-point vertex, which sits on the polygon's own edge and can miss the
 * fill hit-test). Callers must await `settleChart` first — the fill is not
 * hit-testable until the reveal animation completes, and dispatching clicks
 * against a mid-animation chart toggles state unpredictably.
 */
function clickAreaFill(chartRoot: Element, categoryIndex: number, belowValue: number) {
  const host = chartRoot.querySelector<HTMLElement>('div[aria-hidden="true"]')!
  const chart = echarts.getInstanceByDom(host)!
  const [x0] = chart.convertToPixel({ seriesIndex: 0 }, [categoryIndex, 0])
  const [x1] = chart.convertToPixel({ seriesIndex: 0 }, [categoryIndex + 1, 0])
  const [, y] = chart.convertToPixel({ seriesIndex: 0 }, [categoryIndex, belowValue])
  clickPixel(host, (x0 + x1) / 2, y)
}

/**
 * Resolve once the chart's coordinate system answers convertToPixel and the
 * render/animation pipeline reports finished (bounded fallback in case the
 * "finished" event fired before we could attach).
 */
async function settleChart(chartRoot: Element) {
  const host = chartRoot.querySelector<HTMLElement>('div[aria-hidden="true"]')!
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
      resolve()
    }
    chart.on("finished", done)
    setTimeout(done, 1500)
  })
}

export const LinkedBarCharts: Story = {
  render: () => <LinkedBars />,
  parameters: { docs: { source: { code: linkedBarsSource, language: "tsx" } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const admissionsChart = await canvas.findByRole("group", {
      name: "Admissions by district",
    })
    clickCategory(admissionsChart, 0, 840)
    await waitFor(() => {
      expect(canvas.getByTestId("selections-readout").textContent).toContain(
        '{"dimension":"district","values":["Gasabo"]}'
      )
    })
    await canvas.findByRole("button", { name: "Remove filter District: Gasabo" })
    // The sibling chart on the same dimension dims non-matching marks
    const referralsChart = canvas.getByRole("group", { name: "Referrals by district" })
    const referralsHost = referralsChart.querySelector<HTMLElement>('div[aria-hidden="true"]')!
    const referralsInstance = echarts.getInstanceByDom(referralsHost)!
    await waitFor(() => {
      const option = referralsInstance.getOption() as {
        series: Array<{ data: Array<{ itemStyle?: { opacity?: number } }> }>
      }
      const [gasabo, kicukiro] = option.series[0].data
      expect(gasabo.itemStyle?.opacity).toBeUndefined()
      expect(kicukiro.itemStyle?.opacity).toBe(0.25)
    })
    // Ctrl-click accumulates a second selection instead of replacing it
    clickCategory(admissionsChart, 1, 720, true)
    await waitFor(() => {
      expect(canvas.getByTestId("selections-readout").textContent).toContain(
        '"values":["Gasabo","Kicukiro"]'
      )
    })
    await canvas.findByRole("button", { name: "Remove filter District: Kicukiro" })
    await canvas.findByRole("button", { name: "Clear all" })
    // Dismissing a chip removes only that value
    const gasaboChip = canvas.getByRole("button", { name: "Remove filter District: Gasabo" })
    await userEvent.click(gasaboChip)
    await waitFor(() => {
      expect(canvas.getByTestId("selections-readout").textContent).toBe(
        '[{"dimension":"district","values":["Kicukiro"]}]'
      )
    })
    // With one value left, "Clear all" steps aside for the single chip's own remove
    expect(canvas.queryByRole("button", { name: "Clear all" })).not.toBeInTheDocument()
    // Ctrl-click restores a second selection so "Clear all" can be exercised
    clickCategory(admissionsChart, 0, 840, true)
    const clearAll = await canvas.findByRole("button", { name: "Clear all" })
    await userEvent.click(clearAll)
    await waitFor(() => {
      expect(canvas.getByTestId("selections-readout").textContent).toBe("[]")
    })
    expect(canvas.queryByRole("button", { name: /Remove filter/ })).not.toBeInTheDocument()
  },
}

function LinkedMixed() {
  const [selections, setSelections] = React.useState<Array<CrossFilterSelection>>([])
  return (
    <CrossFilterProvider selections={selections} onSelectionsChange={setSelections}>
      <div className="grid max-w-3xl grid-cols-2 gap-4">
        <BarChart
          data={admissions}
          options={{ title: "Admissions by district", height: 240 }}
          crossFilter={{ dimension: "district" }}
        />
        <PieChart
          data={districts}
          options={{ title: "Districts", height: 240 }}
          crossFilter={{ dimension: "district" }}
        />
      </div>
      <pre data-testid="selections-readout" className="mt-4 text-xs text-muted-foreground">
        {JSON.stringify(selections)}
      </pre>
    </CrossFilterProvider>
  )
}

export const LinkedMixedCharts: Story = {
  render: () => <LinkedMixed />,
  parameters: { docs: { source: { code: linkedMixedSource, language: "tsx" } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const admissionsChart = await canvas.findByRole("group", {
      name: "Admissions by district",
    })
    clickCategory(admissionsChart, 0, 840)
    await waitFor(() => {
      expect(canvas.getByTestId("selections-readout").textContent).toContain(
        '{"dimension":"district","values":["Gasabo"]}'
      )
    })
    const pieChart = canvas.getByRole("group", { name: "Districts" })
    const pieHost = pieChart.querySelector<HTMLElement>('div[aria-hidden="true"]')!
    const pieInstance = echarts.getInstanceByDom(pieHost)!
    await waitFor(() => {
      const option = pieInstance.getOption() as {
        series: Array<{ data: Array<{ itemStyle?: { opacity?: number } }> }>
      }
      const [gasabo, kicukiro] = option.series[0].data
      expect(gasabo.itemStyle?.opacity).toBeUndefined()
      expect(kicukiro.itemStyle?.opacity).toBe(0.25)
    })
  },
}

function LinkedAreaChart() {
  const [selections, setSelections] = React.useState<Array<CrossFilterSelection>>([])
  return (
    <CrossFilterProvider selections={selections} onSelectionsChange={setSelections}>
      <div className="max-w-xl">
        <AreaChart
          data={enrollment}
          options={{ title: "Enrollment trend", height: 240 }}
          crossFilter={{ dimension: "district", on: "group" }}
        />
      </div>
      <pre data-testid="selections-readout" className="mt-4 text-xs text-muted-foreground">
        {JSON.stringify(selections)}
      </pre>
    </CrossFilterProvider>
  )
}

export const LinkedAreaChartOnGroup: Story = {
  render: () => <LinkedAreaChart />,
  parameters: { docs: { source: { code: linkedAreaSource, language: "tsx" } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const areaChart = await canvas.findByRole("group", { name: "Enrollment trend" })
    // showSymbol is false, so there's no marker to hit; the polygon click
    // only registers because triggerEvent is set when crossFilter is bound.
    // Settle first, then click exactly ONCE — a click inside a waitFor retry
    // loop toggles the selection on every retry and races the chart rebuild.
    await settleChart(areaChart)
    clickAreaFill(areaChart, 0, 500)
    await waitFor(() => {
      expect(canvas.getByTestId("selections-readout").textContent).toContain(
        '{"dimension":"district","values":["Enrollment"]}'
      )
    })
  },
}
