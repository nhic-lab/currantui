import { TableFooterCount } from "@nhic/currantui/components/table-footer-count"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/TableFooterCount",
  component: TableFooterCount,
  args: {
    shown: 42,
    total: 128,
    label: "records",
  },
} satisfies Meta<typeof TableFooterCount>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSelection: Story = {
  args: { selected: 5 },
}

export const CustomText: Story = {
  args: {
    children: "Showing the 20 most recent submissions",
  },
}
