import { CheckCircleIcon } from "@phosphor-icons/react"

import { Badge } from "@nhic/currantui/components/badge"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "Badge",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge {...args} variant="default">
        Default
      </Badge>
      <Badge {...args} variant="secondary">
        Secondary
      </Badge>
      <Badge {...args} variant="destructive">
        Destructive
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
      <Badge {...args} variant="ghost">
        Ghost
      </Badge>
      <Badge {...args} variant="link">
        Link
      </Badge>
    </div>
  ),
}

export const WithIcon: Story = {
  render: (args) => (
    <Badge {...args} variant="secondary">
      <CheckCircleIcon data-icon="inline-start" />
      Verified
    </Badge>
  ),
}
