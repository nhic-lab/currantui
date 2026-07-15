import { expect, userEvent, waitFor, within } from "storybook/test"

import { ComboChart } from "@nhic/currantui-charts/components/combo-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ChartDataRow } from "@nhic/currantui-charts/lib/types"

const testingVolume: Array<ChartDataRow> = [
  { group: "Tests performed", key: "Jan", value: 61000 },
  { group: "Tests performed", key: "Feb", value: 54000 },
  { group: "Tests performed", key: "Mar", value: 68000 },
  { group: "Tests performed", key: "Apr", value: 72000 },
  { group: "Tests performed", key: "May", value: 66000 },
  { group: "Confirmed cases", key: "Jan", value: 9200 },
  { group: "Confirmed cases", key: "Feb", value: 7600 },
  { group: "Confirmed cases", key: "Mar", value: 11800 },
  { group: "Confirmed cases", key: "Apr", value: 13400 },
  { group: "Confirmed cases", key: "May", value: 10100 },
]

const positivity: Array<ChartDataRow> = [
  { group: "Tests performed", key: "Jan", value: 61000 },
  { group: "Tests performed", key: "Feb", value: 54000 },
  { group: "Tests performed", key: "Mar", value: 68000 },
  { group: "Tests performed", key: "Apr", value: 72000 },
  { group: "Tests performed", key: "May", value: 66000 },
  { group: "Positivity rate", key: "Jan", value: 15.1 },
  { group: "Positivity rate", key: "Feb", value: 14.1 },
  { group: "Positivity rate", key: "Mar", value: 17.4 },
  { group: "Positivity rate", key: "Apr", value: 18.6 },
  { group: "Positivity rate", key: "May", value: 15.3 },
]

const meta = {
  title: "Charts/ComboChart",
  component: ComboChart,
  parameters: {
    docs: {
      description: {
        component:
          "Mixed bar and line marks over one category axis, with `seriesTypes` picking the mark per group. An optional secondary value axis fits a group on a different scale — prefer one axis whenever the series are comparable.",
      },
    },
  },
  args: {
    data: testingVolume,
    options: {
      title: "Malaria testing volume",
      source: "NRL 2026",
      seriesTypes: { "Confirmed cases": "line" },
      xAxis: { label: "Month" },
      yAxis: { label: "Count" },
    },
  },
} satisfies Meta<typeof ComboChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SecondaryAxis: Story = {
  args: {
    data: positivity,
    options: {
      title: "Testing volume and positivity",
      source: "NRL 2026",
      seriesTypes: { "Positivity rate": "line" },
      secondaryYAxis: {
        groups: ["Positivity rate"],
        label: "Positivity (%)",
        formatter: (value) => `${value}%`,
      },
      xAxis: { label: "Month" },
      yAxis: { label: "Tests" },
    },
  },
}

export const Loading: Story = {
  args: {
    options: {
      title: "Malaria testing volume",
      source: "NRL 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Malaria testing volume",
      source: "NRL 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(within(table).getAllByText("Tests performed")).toHaveLength(5)
    await expect(within(table).getByText("61,000")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
