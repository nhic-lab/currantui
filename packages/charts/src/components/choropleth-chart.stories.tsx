import * as React from "react"
import { expect, waitFor, within } from "storybook/test"
import * as echarts from "echarts/core"

import { clickGeoCoord, settleChart } from "@nhic/currantui-charts/testing/canvas-click"
import { BarChart } from "@nhic/currantui-charts/components/bar-chart"
import { ChoroplethChart } from "@nhic/currantui-charts/components/choropleth-chart"
import { CrossFilterBar, CrossFilterProvider } from "@nhic/currantui-charts/components/cross-filter"
import { registerGeoMap } from "@nhic/currantui-charts/lib/geo"

import type { GeoMapJson } from "@nhic/currantui-charts/lib/geo"
import type { CrossFilterSelection } from "@nhic/currantui-charts/lib/cross-filter"
import type { Meta, StoryObj } from "@storybook/react-vite"

const rectangle = (
  name: string,
  originX: number
): GeoMapJson["features"][number] => ({
  type: "Feature",
  properties: { name },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [originX, 0],
        [originX + 10, 0],
        [originX + 10, 10],
        [originX, 10],
        [originX, 0],
      ],
    ],
  },
})

export const demoGeoJson: GeoMapJson = {
  type: "FeatureCollection",
  features: [rectangle("Gasabo", 0), rectangle("Kicukiro", 10), rectangle("Musanze", 20)],
}

registerGeoMap("demo-districts", demoGeoJson)

const meta = {
  title: "Charts/ChoroplethChart",
  component: ChoroplethChart,
  excludeStories: /^demoGeoJson$/,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Region-shaded map on the standard chart shell. Boundaries are app-supplied via registerGeoMap — NHIC apps register official NISR GeoJSON; nothing ships in the package.",
      },
    },
  },
} satisfies Meta<typeof ChoroplethChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: [
      { region: "Gasabo", value: 94 },
      { region: "Kicukiro", value: 82 },
      // Musanze intentionally missing: renders in the no-data fill
    ],
    options: {
      title: "Reporting coverage by district",
      source: "HMIS weekly extract",
      map: "demo-districts",
      height: 260,
      valueFormatter: (value: number) => `${value}%`,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Shell contract present: title, ramp legend labels, footer
    await canvas.findByText("Reporting coverage by district")
    await expect(canvas.getByText("82%")).toBeInTheDocument() // ramp min label
    await expect(canvas.getByText("94%")).toBeInTheDocument() // ramp max label

    // Tooltip formatter: "No data" for a region absent from `data` (Musanze),
    // the formatted value for one present (Gasabo)
    const chartGroup = canvas.getByRole("group", { name: "Reporting coverage by district" })
    const host = chartGroup.querySelector<HTMLElement>('div[aria-hidden="true"]')!
    const instance = echarts.getInstanceByDom(host)!
    const option = instance.getOption() as {
      tooltip: Array<{ formatter: (params: { name: string; value?: number }) => string }>
    }
    expect(option.tooltip[0].formatter({ name: "Musanze", value: undefined })).toContain(
      "No data"
    )
    expect(option.tooltip[0].formatter({ name: "Gasabo", value: 94 })).toContain("94%")
  },
}

export const UnregisteredMap: Story = {
  args: {
    data: [{ region: "Gasabo", value: 94 }],
    options: { title: "Broken map", map: "never-registered", height: 220 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Renders the shell empty state instead of throwing
    await canvas.findByText("No data to display")
  },
}

/*
 * Stateful story renders through a wrapper component, which Storybook's
 * "Show code" cannot expand — it carries an explicit, copyable docs.source
 * snippet instead (test readout omitted).
 */
const linkedMapSource = `
function LinkedMap() {
  const [selections, setSelections] = React.useState<Array<CrossFilterSelection>>([])
  return (
    <CrossFilterProvider selections={selections} onSelectionsChange={setSelections}>
      <div className="grid max-w-3xl grid-cols-2 gap-4">
        <ChoroplethChart
          data={[
            { region: "Gasabo", value: 94 },
            { region: "Kicukiro", value: 82 },
            { region: "Musanze", value: 71 },
          ]}
          options={{ title: "Coverage by district", map: "demo-districts", height: 240 }}
          crossFilter={{ dimension: "district" }}
        />
        <BarChart
          data={[
            { group: "Admissions", key: "Gasabo", value: 840 },
            { group: "Admissions", key: "Kicukiro", value: 720 },
            { group: "Admissions", key: "Musanze", value: 610 },
          ]}
          options={{ title: "Admissions by district", height: 240 }}
          crossFilter={{ dimension: "district" }}
        />
      </div>
      <CrossFilterBar className="mt-3" labels={{ district: "District" }} />
    </CrossFilterProvider>
  )
}
`.trim()

function LinkedMap() {
  const [selections, setSelections] = React.useState<Array<CrossFilterSelection>>([])
  return (
    <CrossFilterProvider selections={selections} onSelectionsChange={setSelections}>
      <div className="grid max-w-3xl grid-cols-2 gap-4">
        <ChoroplethChart
          data={[
            { region: "Gasabo", value: 94 },
            { region: "Kicukiro", value: 82 },
            { region: "Musanze", value: 71 },
          ]}
          options={{ title: "Coverage by district", map: "demo-districts", height: 240 }}
          crossFilter={{ dimension: "district" }}
        />
        <BarChart
          data={[
            { group: "Admissions", key: "Gasabo", value: 840 },
            { group: "Admissions", key: "Kicukiro", value: 720 },
            { group: "Admissions", key: "Musanze", value: 610 },
          ]}
          options={{ title: "Admissions by district", height: 240 }}
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

export const LinkedWithBarChart: Story = {
  // args are unused (render overrides), but required to satisfy the Story type
  args: {
    data: [{ region: "Gasabo", value: 94 }],
    options: { title: "Coverage by district", map: "demo-districts" },
  },
  render: () => <LinkedMap />,
  parameters: { docs: { source: { code: linkedMapSource, language: "tsx" } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const map = await canvas.findByRole("group", { name: "Coverage by district" })
    await settleChart(map)
    clickGeoCoord(map, [5, 5]) // centre of the Gasabo rectangle
    await waitFor(() => {
      expect(canvas.getByTestId("selections-readout").textContent).toContain(
        '{"dimension":"district","values":["Gasabo"]}'
      )
    })
    await canvas.findByRole("button", { name: "Remove filter District: Gasabo" })
    // Sibling bar dims the non-matching districts
    const bar = canvas.getByRole("group", { name: "Admissions by district" })
    const barHost = bar.querySelector<HTMLElement>('div[aria-hidden="true"]')!
    const barInstance = echarts.getInstanceByDom(barHost)!
    await waitFor(() => {
      const option = barInstance.getOption() as {
        series: Array<{ data: Array<{ itemStyle?: { opacity?: number } }> }>
      }
      expect(option.series[0].data[1].itemStyle?.opacity).toBe(0.25)
      expect(option.series[0].data[0].itemStyle?.opacity).toBeUndefined()
    })
  },
}
