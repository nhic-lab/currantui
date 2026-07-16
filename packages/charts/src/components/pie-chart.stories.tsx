import { expect, userEvent, waitFor, within } from "storybook/test"

import { PieChart } from "@nhic/currantui-charts/components/pie-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { PartDataRow } from "@nhic/currantui-charts/lib/types"

const referralSources: Array<PartDataRow> = [
  { group: "Health centers", value: 4820 },
  { group: "District hospitals", value: 2140 },
  { group: "Community health workers", value: 1660 },
  { group: "Private clinics", value: 940 },
  { group: "Self-referral", value: 620 },
]

const meta = {
  title: "Charts/PieChart",
  component: PieChart,
  parameters: {
    docs: {
      description: {
        component:
          "Pie chart for a part-to-whole breakdown with few slices. Slice names live in the HTML legend and the table view; keep to a handful of parts and fold small remainders into an \"Other\" row.",
      },
    },
  },
  args: {
    data: referralSources,
    options: {
      title: "Referrals by source",
      source: "HMIS 2026",
      groupLabel: "Source",
      valueLabel: "Referrals",
    },
  },
} satisfies Meta<typeof PieChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    options: {
      title: "Referrals by source",
      source: "HMIS 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Referrals by source",
      source: "HMIS 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(within(table).getByText("Health centers")).toBeVisible()
    await expect(within(table).getByText("4,820")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
