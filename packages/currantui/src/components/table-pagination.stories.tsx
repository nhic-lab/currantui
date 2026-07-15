import { useState } from "react"
import { expect, fn, userEvent, within } from "storybook/test"

import { TablePagination } from "@nhic/currantui/components/table-pagination"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/TablePagination",
  component: TablePagination,
  args: {
    pageIndex: 0,
    pageCount: 8,
    onPageChange: fn(),
  },
} satisfies Meta<typeof TablePagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithPageSize: Story = {
  args: {
    pageSize: 10,
    onPageSizeChange: fn(),
  },
}

export const WithCounts: Story = {
  args: {
    children: <span>73 of 73 records · 4 selected</span>,
    pageSize: 10,
    onPageSizeChange: fn(),
  },
}

export const BoundsDisabled: Story = {
  args: { pageIndex: 0, pageCount: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ["First page", "Previous page", "Next page", "Last page"]) {
      await expect(canvas.getByRole("button", { name })).toBeDisabled()
    }
  },
}

export const PageInteraction: Story = {
  parameters: {
    docs: {
      source: {
        code: `function ReportPages() {
  const [pageIndex, setPageIndex] = useState(0)
  return (
    <TablePagination
      pageIndex={pageIndex}
      pageCount={8}
      onPageChange={setPageIndex}
    />
  )
}`,
      },
    },
  },
  render: function PageInteractionStory(args) {
    const [pageIndex, setPageIndex] = useState(0)
    return <TablePagination {...args} pageIndex={pageIndex} onPageChange={setPageIndex} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Next page" }))
    await expect(canvas.getByText("Page 2 of 8")).toBeInTheDocument()
    await userEvent.click(canvas.getByRole("button", { name: "Last page" }))
    await expect(canvas.getByText("Page 8 of 8")).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: "Next page" })).toBeDisabled()
    await userEvent.click(canvas.getByRole("button", { name: "First page" }))
    await expect(canvas.getByText("Page 1 of 8")).toBeInTheDocument()
  },
}
