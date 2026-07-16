import { expect, userEvent, waitFor, within } from "storybook/test"

import { DonutChart } from "@nhic/currantui-charts/components/donut-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { PartDataRow } from "@nhic/currantui-charts/lib/types"

const bedOccupancy: Array<PartDataRow> = [
  { group: "Occupied", value: 1284 },
  { group: "Reserved", value: 176 },
  { group: "Available", value: 412 },
]

const meta = {
  title: "Charts/DonutChart",
  component: DonutChart,
  parameters: {
    docs: {
      description: {
        component:
          "Donut chart — a pie with an open center that can carry a headline value via `centerLabel`. The center label is HTML, so it stays crisp, follows the theme tokens, and is read by assistive tech.",
      },
    },
  },
  args: {
    data: bedOccupancy,
    options: {
      title: "Hospital bed status",
      source: "Bed registry 2026",
      groupLabel: "Status",
      valueLabel: "Beds",
    },
  },
} satisfies Meta<typeof DonutChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CenterLabel: Story = {
  args: {
    options: {
      title: "Hospital bed status",
      source: "Bed registry 2026",
      centerLabel: { value: "69%", caption: "occupancy" },
      groupLabel: "Status",
      valueLabel: "Beds",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("69%")).toBeVisible()
    await expect(canvas.getByText("occupancy")).toBeVisible()
  },
}

export const Loading: Story = {
  args: {
    options: {
      title: "Hospital bed status",
      source: "Bed registry 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Hospital bed status",
      source: "Bed registry 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(within(table).getByText("Occupied")).toBeVisible()
    await expect(within(table).getByText("1,284")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
