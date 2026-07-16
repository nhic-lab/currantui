import { expect, userEvent, waitFor, within } from "storybook/test"

import { HistogramChart } from "@nhic/currantui-charts/components/histogram-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"

const waitTimes: Array<number> = [
  8, 12, 14, 15, 17, 18, 19, 21, 22, 22, 23, 24, 25, 25, 26, 27, 27, 28, 29,
  29, 30, 31, 31, 32, 33, 34, 35, 36, 37, 38, 40, 41, 43, 45, 47, 49, 52, 55,
  58, 62,
]

const meta = {
  title: "Charts/HistogramChart",
  component: HistogramChart,
  parameters: {
    docs: {
      description: {
        component:
          "Histogram of a raw sample: values are binned internally (Sturges' rule by default, or a fixed `bins` count / `binWidth`), and the table view and CSV export report the binned distribution.",
      },
    },
  },
  args: {
    data: waitTimes,
    options: {
      title: "Outpatient waiting time distribution",
      source: "Patient flow survey 2026",
      xAxis: { label: "Waiting time (minutes)" },
      yAxis: { label: "Patients" },
    },
  },
} satisfies Meta<typeof HistogramChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FixedBinWidth: Story = {
  args: {
    options: {
      title: "Outpatient waiting time distribution (10-minute bins)",
      source: "Patient flow survey 2026",
      binWidth: 10,
      xAxis: { label: "Waiting time (minutes)" },
      yAxis: { label: "Patients" },
    },
  },
}

export const Loading: Story = {
  args: {
    options: {
      title: "Outpatient waiting time distribution",
      source: "Patient flow survey 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Outpatient waiting time distribution",
      source: "Patient flow survey 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    // 40 samples → Sturges gives 7 bins (+1 header row)
    await expect(within(table).getAllByRole("row")).toHaveLength(8)
    await expect(within(table).getByText("Waiting time (minutes)")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
