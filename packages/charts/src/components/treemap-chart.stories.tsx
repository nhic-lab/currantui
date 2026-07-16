import { expect, userEvent, waitFor, within } from "storybook/test"

import { TreemapChart } from "@nhic/currantui-charts/components/treemap-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { TreemapNode } from "@nhic/currantui-charts/lib/types"

const programBudget: Array<TreemapNode> = [
  {
    name: "Malaria",
    children: [
      { name: "Vector control", value: 3_400_000 },
      { name: "Case management", value: 2_100_000 },
      { name: "Surveillance", value: 800_000 },
    ],
  },
  {
    name: "Immunization",
    children: [
      { name: "Routine program", value: 2_900_000 },
      { name: "Cold chain", value: 1_200_000 },
    ],
  },
  {
    name: "Maternal health",
    children: [
      { name: "Facility deliveries", value: 1_800_000 },
      { name: "Antenatal care", value: 950_000 },
    ],
  },
  { name: "Emergency preparedness", value: 1_100_000 },
]

const meta = {
  title: "Charts/TreemapChart",
  component: TreemapChart,
  parameters: {
    docs: {
      description: {
        component:
          "Treemap of hierarchical part-to-whole data. Click a branch to drill in; the table view and CSV export flatten the hierarchy into path/value rows with branch totals summed from their children.",
      },
    },
  },
  args: {
    data: programBudget,
    options: {
      title: "Program budget allocation",
      source: "Finance unit 2026",
      nameLabel: "Program",
      valueLabel: "Amount (RWF)",
    },
  },
} satisfies Meta<typeof TreemapChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    options: {
      title: "Program budget allocation",
      source: "Finance unit 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Program budget allocation",
      source: "Finance unit 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(
      within(table).getByText("Malaria / Vector control")
    ).toBeVisible()
    // Branch totals sum their children: 3.4M + 2.1M + 0.8M
    const malariaRow = within(table).getByText("Malaria").closest("tr")
    await expect(malariaRow?.textContent).toContain("6,300,000")
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
