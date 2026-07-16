import { expect, userEvent, waitFor, within } from "storybook/test"

import { MeterChart } from "@nhic/currantui-charts/components/meter-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { PartDataRow } from "@nhic/currantui-charts/lib/types"

const budgetExecution: Array<PartDataRow> = [
  { group: "Disbursed", value: 6_400_000 },
  { group: "Committed", value: 2_100_000 },
  { group: "Remaining", value: 1_500_000 },
]

const meta = {
  title: "Charts/MeterChart",
  component: MeterChart,
  parameters: {
    docs: {
      description: {
        component:
          "Proportional linear meter: one horizontal bar whose segments share the total. A compact alternative to a pie chart; tooltips report each segment's value and share.",
      },
    },
  },
  args: {
    data: budgetExecution,
    options: {
      title: "Program budget execution",
      source: "Finance unit 2026",
      groupLabel: "Stage",
      valueLabel: "Amount (RWF)",
    },
  },
} satisfies Meta<typeof MeterChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    options: {
      title: "Program budget execution",
      source: "Finance unit 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Program budget execution",
      source: "Finance unit 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(within(table).getByText("Disbursed")).toBeVisible()
    await expect(within(table).getByText("6,400,000")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
