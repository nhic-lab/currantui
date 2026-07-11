import { Separator } from "@nhic/currantui/components/separator"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Separator",
  component: Separator,
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-64 text-xs/relaxed">
      <p>Radiology</p>
      <Separator {...args} className="my-2" />
      <p>Laboratory</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-5 items-center gap-2 text-xs/relaxed">
      <span>Docs</span>
      <Separator {...args} orientation="vertical" />
      <span>API</span>
      <Separator {...args} orientation="vertical" />
      <span>Support</span>
    </div>
  ),
}
