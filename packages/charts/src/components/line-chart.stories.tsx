import { expect, userEvent, waitFor, within } from "storybook/test"

import { LineChart } from "@nhic/currantui-charts/components/line-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ChartDataRow } from "@nhic/currantui-charts/lib/types"

const monthlyConsultations: Array<ChartDataRow> = [
  { group: "Outpatient", key: "Jan", value: 42100 },
  { group: "Outpatient", key: "Feb", value: 39800 },
  { group: "Outpatient", key: "Mar", value: 44700 },
  { group: "Outpatient", key: "Apr", value: 41200 },
  { group: "Outpatient", key: "May", value: 46900 },
  { group: "Outpatient", key: "Jun", value: 45300 },
  { group: "Community health", key: "Jan", value: 28400 },
  { group: "Community health", key: "Feb", value: 30100 },
  { group: "Community health", key: "Mar", value: 29500 },
  { group: "Community health", key: "Apr", value: 33800 },
  { group: "Community health", key: "May", value: 35200 },
  { group: "Community health", key: "Jun", value: 36700 },
]

const meta = {
  title: "Charts/LineChart",
  component: LineChart,
  parameters: {
    docs: {
      description: {
        component:
          "Line chart for change over an ordered domain. Data rows follow the `{ group, key, value }` shape; each group renders as one line in fixed palette order.",
      },
    },
  },
  args: {
    data: monthlyConsultations,
    options: {
      title: "Consultations per month",
      source: "HMIS 2026",
      xAxis: { label: "Month" },
      yAxis: { label: "Consultations" },
    },
  },
} satisfies Meta<typeof LineChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Smooth: Story = {
  args: {
    options: {
      title: "Consultations per month (smoothed)",
      source: "HMIS 2026",
      curve: "smooth",
      xAxis: { label: "Month" },
      yAxis: { label: "Consultations" },
    },
  },
}

export const WithoutPoints: Story = {
  args: {
    options: {
      title: "Consultations per month",
      source: "HMIS 2026",
      points: false,
      xAxis: { label: "Month" },
      yAxis: { label: "Consultations" },
    },
  },
}

export const SingleSeries: Story = {
  args: {
    data: monthlyConsultations.filter((row) => row.group === "Outpatient"),
    options: {
      title: "Outpatient consultations per month",
      source: "HMIS 2026",
      xAxis: { label: "Month" },
      yAxis: { label: "Consultations" },
    },
  },
}

export const Loading: Story = {
  args: {
    options: {
      title: "Consultations per month",
      source: "HMIS 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Consultations per month",
      source: "HMIS 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(within(table).getAllByText("Outpatient")).toHaveLength(6)
    await expect(within(table).getByText("42,100")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
