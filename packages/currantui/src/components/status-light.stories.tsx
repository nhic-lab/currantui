import { StatusLight } from "@nhic/currantui/components/status-light"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/StatusLight",
  component: StatusLight,
  args: {
    children: "Published",
    variant: "success",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "info", "destructive", "muted"],
    },
  },
} satisfies Meta<typeof StatusLight>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <StatusLight variant="success">Published</StatusLight>
      <StatusLight variant="info">In review</StatusLight>
      <StatusLight variant="warning">Awaiting approval</StatusLight>
      <StatusLight variant="destructive">Rejected</StatusLight>
      <StatusLight variant="default">Syncing</StatusLight>
      <StatusLight variant="muted">Archived</StatusLight>
    </div>
  ),
}
