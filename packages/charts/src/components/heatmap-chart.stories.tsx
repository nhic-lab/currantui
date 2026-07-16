import { expect, userEvent, waitFor, within } from "storybook/test"

import { HeatmapChart } from "@nhic/currantui-charts/components/heatmap-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { HeatmapDataRow } from "@nhic/currantui-charts/lib/types"

const provinces = ["Kigali City", "Eastern", "Northern", "Southern", "Western"]
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
const completenessValues = [
  [98, 97, 99, 98, 96, 99],
  [84, 87, 82, 90, 88, 91],
  [79, 83, 85, 81, 86, 88],
  [88, 85, 90, 92, 87, 89],
  [72, 78, 75, 80, 83, 85],
]
const reportingCompleteness: Array<HeatmapDataRow> = provinces.flatMap(
  (province, p) =>
    months.map((month, m) => ({
      x: month,
      y: province,
      value: completenessValues[p][m],
    }))
)

const meta = {
  title: "Charts/HeatmapChart",
  component: HeatmapChart,
  parameters: {
    docs: {
      description: {
        component:
          "Heatmap over two category axes with the value encoded as a single-hue sequential ramp (light → dark). The ramp legend is HTML and the table view carries the exact numbers.",
      },
    },
  },
  args: {
    data: reportingCompleteness,
    options: {
      title: "Reporting completeness by province",
      source: "HMIS 2026",
      valueLabel: "Completeness (%)",
      xAxis: { label: "Month" },
      yAxis: { label: "Province" },
    },
  },
} satisfies Meta<typeof HeatmapChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    options: {
      title: "Reporting completeness by province",
      source: "HMIS 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Reporting completeness by province",
      source: "HMIS 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(within(table).getAllByText("Kigali City")).toHaveLength(6)
    await expect(within(table).getAllByRole("row")).toHaveLength(31)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
