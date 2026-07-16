import { expect, userEvent, waitFor, within } from "storybook/test"

import { BubbleChart } from "@nhic/currantui-charts/components/bubble-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { BubbleDataRow } from "@nhic/currantui-charts/lib/types"

const districtProfile: Array<BubbleDataRow> = [
  { group: "Eastern", x: 74, y: 128, size: 412000 },
  { group: "Eastern", x: 81, y: 96, size: 356000 },
  { group: "Eastern", x: 68, y: 154, size: 298000 },
  { group: "Northern", x: 86, y: 72, size: 264000 },
  { group: "Northern", x: 90, y: 58, size: 221000 },
  { group: "Western", x: 71, y: 141, size: 387000 },
  { group: "Western", x: 78, y: 112, size: 341000 },
  { group: "Kigali City", x: 93, y: 44, size: 486000 },
]

const meta = {
  title: "Charts/BubbleChart",
  component: BubbleChart,
  parameters: {
    docs: {
      description: {
        component:
          "Scatter chart with a third measure encoded as mark size. Sizes map to mark *area* through a square-root scale, so a value twice as large reads as twice the ink.",
      },
    },
  },
  args: {
    data: districtProfile,
    options: {
      title: "Coverage, incidence, and population by district",
      source: "DHS 2026",
      groupLabel: "Province",
      sizeLabel: "Population",
      xAxis: { label: "Coverage (%)" },
      yAxis: { label: "Incidence per 1,000" },
    },
  },
} satisfies Meta<typeof BubbleChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    options: {
      title: "Coverage, incidence, and population by district",
      source: "DHS 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Coverage, incidence, and population by district",
      source: "DHS 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(within(table).getByText("Population")).toBeVisible()
    await expect(within(table).getByText("486,000")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
