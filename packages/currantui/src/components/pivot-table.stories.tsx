import { expect, userEvent, waitFor, within } from "storybook/test"

import { PivotTable } from "@nhic/currantui/components/pivot-table"

import type { Meta, StoryObj } from "@storybook/react-vite"

const reporting = [
  { province: "Kigali", district: "Gasabo", quarter: "Q1", reports: 40 },
  { province: "Kigali", district: "Gasabo", quarter: "Q2", reports: 44 },
  { province: "Kigali", district: "Kicukiro", quarter: "Q1", reports: 30 },
  { province: "Kigali", district: "Kicukiro", quarter: "Q2", reports: 34 },
  { province: "North", district: "Musanze", quarter: "Q1", reports: 26 },
  { province: "North", district: "Musanze", quarter: "Q2", reports: 28 },
]

const meta = {
  title: "Components/PivotTable",
  component: PivotTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Config-driven pivot/matrix table: rows, columns, and aggregated values as props; collapsible row groups with true descendant subtotals and a grand-total row.",
      },
    },
  },
} satisfies Meta<typeof PivotTable>

export default meta
type Story = StoryObj<typeof meta>

export const TwoAxis: Story = {
  args: {
    data: reporting,
    config: {
      rows: ["province", "district"],
      columns: ["quarter"],
      values: [{ field: "reports", aggregate: "sum", label: "Reports" }],
    },
    caption: "Facility reports by province, district, and quarter",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Depth 0 expanded by default: districts visible, Kigali subtotal on the group row
    const kigaliToggle = canvas.getByRole("button", { name: "Toggle Kigali" })
    await expect(kigaliToggle).toHaveAttribute("aria-expanded", "true")
    await expect(canvas.getByText("Gasabo")).toBeInTheDocument()
    const kigaliRow = kigaliToggle.closest("tr")!
    expect(within(kigaliRow).getByText("70")).toBeInTheDocument() // Q1 subtotal 40+30
    // Collapse hides children but keeps the subtotal row
    await userEvent.click(kigaliToggle)
    await waitFor(() => {
      expect(kigaliToggle).toHaveAttribute("aria-expanded", "false")
      expect(canvas.queryByText("Gasabo")).not.toBeInTheDocument()
    })
    expect(within(kigaliRow).getByText("70")).toBeInTheDocument()
    // Grand total row
    const totalRow = canvas.getByText("Total").closest("tr")!
    expect(within(totalRow).getByText("96")).toBeInTheDocument() // Q1: 40+30+26
  },
}

export const RowOnlyFormatted: Story = {
  args: {
    data: reporting,
    config: {
      rows: ["district"],
      values: [
        {
          field: "reports",
          aggregate: "sum",
          label: "Reports",
          formatter: (value: number) => value.toLocaleString("en-US"),
        },
        { field: "reports", aggregate: "mean", label: "Mean" },
      ],
    },
    caption: "Reports by district",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gasaboRow = canvas.getByText("Gasabo").closest("tr")!
    await expect(within(gasaboRow).getByText("84")).toBeInTheDocument()
    await expect(within(gasaboRow).getByText("42")).toBeInTheDocument()
  },
}
