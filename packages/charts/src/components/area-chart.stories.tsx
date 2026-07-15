import { expect, userEvent, waitFor, within } from "storybook/test"

import { AreaChart } from "@nhic/currantui-charts/components/area-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ChartDataRow } from "@nhic/currantui-charts/lib/types"

const dosesAdministered: Array<ChartDataRow> = [
  { group: "Routine immunization", key: "Q1", value: 182000 },
  { group: "Routine immunization", key: "Q2", value: 195000 },
  { group: "Routine immunization", key: "Q3", value: 178000 },
  { group: "Routine immunization", key: "Q4", value: 201000 },
  { group: "Catch-up campaigns", key: "Q1", value: 46000 },
  { group: "Catch-up campaigns", key: "Q2", value: 71000 },
  { group: "Catch-up campaigns", key: "Q3", value: 38000 },
  { group: "Catch-up campaigns", key: "Q4", value: 55000 },
]

const meta = {
  title: "Charts/AreaChart",
  component: AreaChart,
  parameters: {
    docs: {
      description: {
        component:
          "Area chart for emphasizing volume under a trend. Stack the series to read a cumulative total; unstacked fills stay light so overlapping series remain readable.",
      },
    },
  },
  args: {
    data: dosesAdministered,
    options: {
      title: "Vaccine doses administered",
      source: "EPI program 2026",
      xAxis: { label: "Quarter" },
      yAxis: { label: "Doses" },
    },
  },
} satisfies Meta<typeof AreaChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Stacked: Story = {
  args: {
    options: {
      title: "Vaccine doses administered (stacked)",
      source: "EPI program 2026",
      stacked: true,
      xAxis: { label: "Quarter" },
      yAxis: { label: "Doses" },
    },
  },
}

export const Smooth: Story = {
  args: {
    options: {
      title: "Vaccine doses administered (smoothed)",
      source: "EPI program 2026",
      curve: "smooth",
      xAxis: { label: "Quarter" },
      yAxis: { label: "Doses" },
    },
  },
}

export const Loading: Story = {
  args: {
    options: {
      title: "Vaccine doses administered",
      source: "EPI program 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Vaccine doses administered",
      source: "EPI program 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(within(table).getAllByText("Catch-up campaigns")).toHaveLength(4)
    await expect(within(table).getByText("182,000")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
