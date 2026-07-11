import { FunnelSimpleIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"

import { TableEmptyState } from "@nhic/currantui/components/table-empty-state"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/TableEmptyState",
  component: TableEmptyState,
  args: {
    children: "No rows match the current filters.",
  },
  argTypes: {
    icon: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="flex h-48 flex-col rounded-md border border-border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: <FunnelSimpleIcon />,
  },
}

export const NoResults: Story = {
  args: {
    icon: <MagnifyingGlassIcon />,
    children: "Nothing found for “tuberculosis 2024”. Try a broader search.",
  },
}
