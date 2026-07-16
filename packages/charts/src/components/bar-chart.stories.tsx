import { expect, userEvent, waitFor, within } from "storybook/test"

import { BarChart } from "@nhic/currantui-charts/components/bar-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ChartDataRow } from "@nhic/currantui-charts/lib/types"

const confirmedCases: Array<ChartDataRow> = [
  { group: "Malaria", key: "Q1", value: 12400 },
  { group: "Malaria", key: "Q2", value: 15800 },
  { group: "Malaria", key: "Q3", value: 9200 },
  { group: "Malaria", key: "Q4", value: 11600 },
  { group: "Respiratory infections", key: "Q1", value: 8700 },
  { group: "Respiratory infections", key: "Q2", value: 7300 },
  { group: "Respiratory infections", key: "Q3", value: 10100 },
  { group: "Respiratory infections", key: "Q4", value: 12900 },
  { group: "Diarrheal disease", key: "Q1", value: 4300 },
  { group: "Diarrheal disease", key: "Q2", value: 5100 },
  { group: "Diarrheal disease", key: "Q3", value: 6200 },
  { group: "Diarrheal disease", key: "Q4", value: 4800 },
]

const stockChange: Array<ChartDataRow> = [
  { group: "Received", key: "ACT", value: 64000 },
  { group: "Received", key: "ORS", value: 33000 },
  { group: "Received", key: "Amoxicillin", value: 51000 },
  { group: "Dispensed", key: "ACT", value: -56000 },
  { group: "Dispensed", key: "ORS", value: -21000 },
  { group: "Dispensed", key: "Amoxicillin", value: -35000 },
]

const meta = {
  title: "Charts/BarChart",
  component: BarChart,
  parameters: {
    docs: {
      description: {
        component:
          "Bar chart for comparing values across categories, in grouped or stacked mode and vertical or horizontal orientation. Data rows follow the `{ group, key, value }` shape; the table view and CSV export are derived from the same rows.",
      },
    },
  },
  args: {
    data: confirmedCases,
    options: {
      title: "Confirmed cases by quarter",
      source: "HMIS 2025",
      xAxis: { label: "Quarter" },
      yAxis: { label: "Cases" },
    },
  },
} satisfies Meta<typeof BarChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Stacked: Story = {
  args: {
    options: {
      title: "Confirmed cases by quarter (stacked)",
      source: "HMIS 2025",
      mode: "stacked",
      xAxis: { label: "Quarter" },
      yAxis: { label: "Cases" },
    },
  },
}

export const Horizontal: Story = {
  args: {
    options: {
      title: "Confirmed cases by quarter (horizontal)",
      source: "HMIS 2025",
      orientation: "horizontal",
      xAxis: { label: "Cases" },
      yAxis: { label: "Quarter" },
    },
  },
}

export const HorizontalStacked: Story = {
  args: {
    options: {
      title: "Confirmed cases by quarter (horizontal, stacked)",
      source: "HMIS 2025",
      orientation: "horizontal",
      mode: "stacked",
      xAxis: { label: "Cases" },
      yAxis: { label: "Quarter" },
    },
  },
}

export const NegativeValues: Story = {
  args: {
    data: stockChange,
    options: {
      title: "Essential medicine stock movement",
      description: "Units received and dispensed this quarter",
      source: "eLMIS 2026",
      xAxis: { label: "Commodity" },
      yAxis: { label: "Units" },
    },
  },
}

export const Loading: Story = {
  args: {
    options: {
      title: "Confirmed cases by quarter",
      source: "HMIS 2025",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Confirmed cases by quarter",
      source: "HMIS 2025",
      emptyState: {
        description: "Adjust the reporting period to see results.",
      },
    },
  },
}

export const LegendToggle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const item = canvas.getByRole("button", { name: "Malaria" })
    await expect(item).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(item)
    await expect(item).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(item)
    await expect(item).toHaveAttribute("aria-pressed", "true")
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(within(table).getAllByText("Malaria")).toHaveLength(4)
    await expect(within(table).getByText("12,400")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
