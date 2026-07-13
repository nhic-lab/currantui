import { Skeleton } from "@nhic/currantui/components/skeleton"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-1/2" />
    </div>
  ),
}

export const CardShape: Story = {
  render: () => (
    <div className="flex w-72 items-center gap-3">
      <Skeleton className="size-7 rounded-full" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  ),
}
