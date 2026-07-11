import { DownloadSimpleIcon, UserPlusIcon } from "@phosphor-icons/react"
import { expect, fn, userEvent, within } from "storybook/test"

import { TableSelectionBar } from "@nhic/currantui/components/table-selection-bar"
import { Button } from "@nhic/currantui/components/button"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/TableSelectionBar",
  component: TableSelectionBar,
  args: {
    count: 3,
    onClear: fn(),
  },
} satisfies Meta<typeof TableSelectionBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithActions: Story = {
  render: (args) => (
    <TableSelectionBar {...args}>
      <Button size="xs" variant="ghost" className="h-6 gap-1 text-[11px]">
        <DownloadSimpleIcon size={12} />
        Export CSV
      </Button>
      <Button size="xs" variant="ghost" className="h-6 gap-1 text-[11px]">
        <UserPlusIcon size={12} />
        Assign to me
      </Button>
    </TableSelectionBar>
  ),
}

export const ClearInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: /clear/i }))
    await expect(args.onClear).toHaveBeenCalledOnce()
  },
}

export const HiddenAtZero: Story = {
  args: { count: 0 },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("button")).toBeNull()
  },
}
