import { HicLogo } from "@nhic/currantui/components/hic-logo"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/HicLogo",
  component: HicLogo,
} satisfies Meta<typeof HicLogo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  /* Page-relative: the deployed Storybook lives under a subpath, so the
     domain-absolute default (`/logo.svg`, the real consumer contract) 404s */
  render: (args) => <HicLogo {...args} src="./logo.svg" />,
  parameters: {
    docs: { source: { code: "<HicLogo />", language: "tsx" } },
  },
}

export const WithStamp: Story = {
  args: { stamp: "DOCS" },
  render: (args) => <HicLogo {...args} src="./logo.svg" />,
  parameters: {
    docs: { source: { code: '<HicLogo stamp="DOCS" />', language: "tsx" } },
  },
}

export const Compact: Story = {
  args: { compact: true },
  render: (args) => <HicLogo {...args} src="./logo.svg" />,
  parameters: {
    docs: { source: { code: "<HicLogo compact />", language: "tsx" } },
  },
}
