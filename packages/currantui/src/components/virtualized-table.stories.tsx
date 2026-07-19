import { expect, fn, userEvent, waitFor, within } from "storybook/test"

import { VirtualizedTable } from "@nhic/currantui/components/virtualized-table"

import type { Meta, StoryObj } from "@storybook/react-vite"

interface FacilityRow {
  id: number
  name: string
  district: string
  reports: number
}

const facilities: Array<FacilityRow> = Array.from({ length: 100_000 }, (_, index) => ({
  id: index + 1,
  name: `Facility ${index + 1}`,
  district: ["Gasabo", "Kicukiro", "Musanze", "Huye"][index % 4],
  reports: (index * 7) % 120,
}))

const columns = [
  { header: "Facility", value: (row: FacilityRow) => row.name },
  { header: "District", value: (row: FacilityRow) => row.district },
  {
    header: "Reports",
    value: (row: FacilityRow) => row.reports.toLocaleString(),
    align: "end" as const,
  },
]

const meta: Meta<typeof VirtualizedTable<FacilityRow>> = {
  title: "Components/VirtualizedTable",
  component: VirtualizedTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Semantic table windowed with @tanstack/react-virtual — only the visible slice renders, proven at 100,000 rows. State the total row count in the caption: assistive tech only sees rendered rows.",
      },
    },
  },
  /*
   * Data-shaped props must stay out of the args system: the docs args table
   * and the Controls channel serialize arg values, and the 100k-row array
   * rendered a 2.2-million-pixel docs page and froze the manager. Stories
   * inject data via render instead.
   */
  args: { rows: [], columns: [], caption: "" },
  argTypes: {
    rows: { control: false, table: { disable: true } },
    columns: { control: false, table: { disable: true } },
    getRowKey: { control: false, table: { disable: true } },
    onRowClick: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const HundredThousandRows: Story = {
  args: {
    caption: `All facilities (${facilities.length.toLocaleString()} rows)`,
  },
  render: (args) => (
    <VirtualizedTable
      {...args}
      rows={facilities}
      columns={columns}
      getRowKey={(row) => row.id}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText("Facility 1")
    const renderedRows = () =>
      canvasElement.querySelectorAll("tbody tr:not([data-slot=virtual-spacer])")
    expect(renderedRows().length).toBeLessThan(100)
    // Scroll to the end: the final row materializes
    const viewport = canvasElement.querySelector<HTMLElement>(
      '[data-slot="virtualized-table-viewport"]'
    )!
    viewport.scrollTop = viewport.scrollHeight
    await waitFor(() => {
      expect(canvas.getByText("Facility 100000")).toBeInTheDocument()
    })
    expect(renderedRows().length).toBeLessThan(100)
    // Gross range-math sanity after scroll-to-end: the first rendered row should be near
    // the tail of the dataset. This is a coarse check (slack far exceeds any scrollMargin
    // drift) — it does not guard the sticky header, which the assertion below covers.
    const firstRenderedIndex = Number(
      renderedRows()[0].getAttribute("data-index")
    )
    expect(firstRenderedIndex).toBeGreaterThan(99_800)
    // The sticky header must stay pinned to the viewport top even after scrolling —
    // regression guard for the wrapper div stealing the sticky containing block.
    const thead = canvasElement.querySelector("thead")!
    const viewportRect = viewport.getBoundingClientRect()
    expect(
      Math.abs(thead.getBoundingClientRect().top - viewportRect.top)
    ).toBeLessThanOrEqual(1)
  },
}

export const Empty: Story = {
  args: {
    caption: "All facilities (0 rows)",
  },
  render: (args) => <VirtualizedTable {...args} rows={[]} columns={columns} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("No rows to display")).toBeInTheDocument()
  },
}

const smallFacilities = facilities.slice(0, 50)

export const Interactive: Story = {
  args: {
    caption: `All facilities (${smallFacilities.length} rows)`,
    onRowClick: fn(),
  },
  render: (args) => (
    <VirtualizedTable
      {...args}
      rows={smallFacilities}
      columns={columns}
      getRowKey={(row) => row.id}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText("Facility 1")
    const dataRows = () =>
      canvas.getAllByRole("row").filter((row) => row.hasAttribute("data-index"))

    const firstRow = dataRows()[0]
    firstRow.focus()
    await userEvent.keyboard("{Enter}")
    expect(args.onRowClick).toHaveBeenCalledWith(smallFacilities[0])

    const thirdRow = dataRows()[2]
    await userEvent.click(thirdRow)
    expect(args.onRowClick).toHaveBeenCalledWith(smallFacilities[2])
  },
}
