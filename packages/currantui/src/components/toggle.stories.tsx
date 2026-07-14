import { PushPinIcon } from "@phosphor-icons/react"

import { Toggle } from "@nhic/currantui/components/toggle"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/Toggle",
  component: Toggle,
  args: {
    children: "Pin column",
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["sm", "default", "lg"] },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Pressed: Story = {
  args: { defaultPressed: true },
}

export const IconOnly: Story = {
  args: { "aria-label": "Pin column", children: <PushPinIcon /> },
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Toggle {...args} variant="default">
        Default
      </Toggle>
      <Toggle {...args} variant="outline">
        Outline
      </Toggle>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Toggle {...args} size="sm">
        Small
      </Toggle>
      <Toggle {...args} size="default">
        Default
      </Toggle>
      <Toggle {...args} size="lg">
        Large
      </Toggle>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}
