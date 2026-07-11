import { SortIndicator } from "@nhic/currantui/components/sort-indicator"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/SortIndicator",
  component: SortIndicator,
  args: {
    direction: false,
  },
  argTypes: {
    direction: {
      control: "select",
      options: [false, "asc", "desc"],
    },
  },
} satisfies Meta<typeof SortIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-6 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
      <span className="flex items-center gap-1">
        Unsorted <SortIndicator direction={false} />
      </span>
      <span className="flex items-center gap-1">
        Ascending <SortIndicator direction="asc" />
      </span>
      <span className="flex items-center gap-1">
        Descending <SortIndicator direction="desc" />
      </span>
    </div>
  ),
}
