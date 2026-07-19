import * as React from "react"
import * as echarts from "echarts/core"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  clickAreaFill,
  clickCategory,
  settleChart,
} from "@nhic/currantui-charts/testing/canvas-click"
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


export const LinkedBarCharts: Story = {
  render: () => <LinkedBars />,
  parameters: { docs: { source: { code: linkedBarsSource, language: "tsx" } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const admissionsChart = await canvas.findByRole("group", {
      name: "Admissions by district",
    })
    // CI runners are slow enough that the initial render animation is still
    // in flight when the click lands — settle first or the hit-test misses
    await settleChart(admissionsChart)
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
    // Focus moves to the nearest surviving chip, not to <body>
    await waitFor(() => {
      expect(document.activeElement).toBe(
        canvas.getByRole("button", { name: "Remove filter District: Kicukiro" })
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
    // With no chips left, focus lands on the bar itself
    await waitFor(() => {
      expect(document.activeElement).toBe(
        canvasElement.querySelector('[data-slot="cross-filter-bar"]')
      )
    })
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
    // CI runners are slow enough that the initial render animation is still
    // in flight when the click lands — settle first or the hit-test misses
    await settleChart(admissionsChart)
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
