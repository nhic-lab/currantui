import { expect, userEvent, waitFor, within } from "storybook/test"

import { BoxplotChart } from "@nhic/currantui-charts/components/boxplot-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { BoxplotDataRow } from "@nhic/currantui-charts/lib/types"

const lengthOfStay: Array<BoxplotDataRow> = [
  ...[2, 3, 3, 4, 4, 5, 5, 6, 21].map((value) => ({
    group: "Maternity",
    value,
  })),
  ...[3, 4, 5, 6, 7, 8, 9, 10].map((value) => ({ group: "Surgery", value })),
  ...[1, 2, 2, 3, 3, 3, 4, 4, 5].map((value) => ({
    group: "Pediatrics",
    value,
  })),
]

const meta = {
  title: "Charts/BoxplotChart",
  component: BoxplotChart,
  parameters: {
    docs: {
      description: {
        component:
          "Boxplot of raw samples per group: quartiles, whiskers (1.5×IQR), and outliers are computed internally. The table view and CSV export report the five-number summary and outlier count per group.",
      },
    },
  },
  args: {
    data: lengthOfStay,
    options: {
      title: "Length of stay by department",
      source: "Admissions registry 2026",
      groupLabel: "Department",
      xAxis: { label: "Department" },
      yAxis: { label: "Days" },
    },
  },
} satisfies Meta<typeof BoxplotChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    options: {
      title: "Length of stay by department",
      source: "Admissions registry 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Length of stay by department",
      source: "Admissions registry 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    // Surgery: 8 samples → median interpolates to 6.5 (type-7 quantile)
    await expect(within(table).getByText("6.5")).toBeVisible()
    await expect(within(table).getByText("Median")).toBeVisible()
    // Maternity's 21-day stay sits beyond the 1.5×IQR fence → 1 outlier
    const maternityRow = within(table).getByText("Maternity").closest("tr")
    const cells = within(maternityRow as HTMLElement).getAllByRole("cell")
    await expect(cells[6]).toHaveTextContent("1")
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
