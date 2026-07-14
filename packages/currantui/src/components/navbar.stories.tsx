import { AvatarButton } from "@nhic/currantui/components/avatar-button"
import { HicLogo } from "@nhic/currantui/components/hic-logo"
import { Navbar } from "@nhic/currantui/components/navbar"
import { NotificationsButton } from "@nhic/currantui/components/notifications-button"
import { ThemeToggle } from "@nhic/currantui/components/theme-toggle"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Navbar",
  tags: ["deprecated"],
  component: Navbar,
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: "Deprecated — use `ShellHeader` from the Shell family instead; removal planned for the next major." } },
  },
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    leftSlot: <HicLogo stamp="DOCS" />,
    rightSlot: (
      <>
        <NotificationsButton />
        <ThemeToggle />
        <AvatarButton name="A. Uwase" email="analyst@example.org" />
      </>
    ),
  },
}

export const Minimal: Story = {
  args: {
    leftSlot: <HicLogo compact />,
  },
}
