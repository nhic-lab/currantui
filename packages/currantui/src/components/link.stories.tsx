import { ArrowSquareOutIcon } from "@phosphor-icons/react"

import { Link } from "@nhic/currantui/components/link"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Link",
  component: Link,
  args: {
    children: "View full report",
    href: "#",
  },
  argTypes: {
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithIcon: Story = {
  render: (args) => (
    <Link {...args}>
      Open in DHIS2
      <ArrowSquareOutIcon />
    </Link>
  ),
}

export const Disabled: Story = {
  args: { "aria-disabled": true, href: undefined },
}

export const InText: Story = {
  render: (args) => (
    <p className="w-72 text-xs/relaxed text-foreground">
      Submission rates are computed weekly; see the{" "}
      <Link {...args}>reporting guidelines</Link> for the full methodology.
    </p>
  ),
}
