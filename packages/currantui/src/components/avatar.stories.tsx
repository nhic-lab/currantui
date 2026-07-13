import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@nhic/currantui/components/avatar"

import type { Meta, StoryObj } from "@storybook/react-vite"

/* Inline SVG portrait so stories stay offline-deterministic. */
const SAMPLE_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#2d6a76"/><circle cx="16" cy="12" r="6" fill="#e8f2f4"/><path d="M4 32c0-7 5-11 12-11s12 4 12 11" fill="#e8f2f4"/></svg>'
)}`

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg"],
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={SAMPLE_IMAGE} alt="Bellamy Dan" />
      <AvatarFallback>BD</AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>BD</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Avatar size="xs">
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const WithBadge: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={SAMPLE_IMAGE} alt="Bellamy Dan (online)" />
      <AvatarFallback>BD</AvatarFallback>
      <AvatarBadge aria-hidden="true" />
    </Avatar>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src={SAMPLE_IMAGE} alt="Bellamy Dan" />
        <AvatarFallback>BD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AK</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JM</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
}
