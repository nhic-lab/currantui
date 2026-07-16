import { expect, userEvent, waitFor, within } from "storybook/test"

import { ScatterChart } from "@nhic/currantui-charts/components/scatter-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ScatterDataRow } from "@nhic/currantui-charts/lib/types"

const staffingVsConsultations: Array<ScatterDataRow> = [
  { group: "Health centers", x: 6, y: 890 },
  { group: "Health centers", x: 9, y: 1240 },
  { group: "Health centers", x: 11, y: 1410 },
  { group: "Health centers", x: 14, y: 1620 },
  { group: "Health centers", x: 17, y: 2050 },
  { group: "Health centers", x: 21, y: 2380 },
  { group: "District hospitals", x: 38, y: 3350 },
  { group: "District hospitals", x: 47, y: 3980 },
  { group: "District hospitals", x: 55, y: 4370 },
  { group: "District hospitals", x: 64, y: 5160 },
  { group: "District hospitals", x: 72, y: 5540 },
]

const meta = {
  title: "Charts/ScatterChart",
  component: ScatterChart,
  parameters: {
    docs: {
      description: {
        component:
          "Scatter chart relating two measures. Rows follow the `{ group, x, y }` shape; each group renders as one mark series in fixed palette order.",
      },
    },
  },
  args: {
    data: staffingVsConsultations,
    options: {
      title: "Staffing vs monthly consultations",
      source: "HRIS · HMIS 2026",
      groupLabel: "Facility type",
      xAxis: { label: "Clinical staff" },
      yAxis: { label: "Consultations" },
    },
  },
} satisfies Meta<typeof ScatterChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    options: {
      title: "Staffing vs monthly consultations",
      source: "HRIS · HMIS 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Staffing vs monthly consultations",
      source: "HRIS · HMIS 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(within(table).getByText("Clinical staff")).toBeVisible()
    await expect(within(table).getByText("1,240")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
