import { HicLogo } from "@nhic/currantui/components/hic-logo"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/HicLogo",
  component: HicLogo,
} satisfies Meta<typeof HicLogo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithStamp: Story = {
  args: { stamp: "DOCS" },
}

export const Compact: Story = {
  args: { compact: true },
}
