import { Gear, SignOut } from "@phosphor-icons/react"

import {
  AvatarButton,
  AvatarButtonItem,
  AvatarButtonLabel,
  AvatarButtonMenu,
  AvatarButtonSeparator,
  AvatarButtonTrigger,
} from "@nhic/currantui/components/avatar-button"
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
    /* Page-relative: the deployed Storybook lives under a subpath */
    leftSlot: <HicLogo stamp="DOCS" src="./logo.svg" />,
    rightSlot: (
      <>
        <NotificationsButton />
        <ThemeToggle />
        <AvatarButton>
          <AvatarButtonTrigger name="A. Uwase" />
          <AvatarButtonMenu>
            <AvatarButtonLabel name="A. Uwase" email="analyst@example.org" />
            <AvatarButtonSeparator />
            <AvatarButtonItem icon={Gear}>Settings</AvatarButtonItem>
            <AvatarButtonSeparator />
            <AvatarButtonItem icon={SignOut} destructive>
              Sign out
            </AvatarButtonItem>
          </AvatarButtonMenu>
        </AvatarButton>
      </>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `<Navbar
  leftSlot={<HicLogo stamp="DOCS" />}
  rightSlot={
    <>
      <NotificationsButton />
      <ThemeToggle />
      <AvatarButton>
        <AvatarButtonTrigger name="A. Uwase" />
        <AvatarButtonMenu>
          <AvatarButtonLabel name="A. Uwase" email="analyst@example.org" />
          <AvatarButtonSeparator />
          <AvatarButtonItem icon={Gear}>Settings</AvatarButtonItem>
          <AvatarButtonSeparator />
          <AvatarButtonItem icon={SignOut} destructive>
            Sign out
          </AvatarButtonItem>
        </AvatarButtonMenu>
      </AvatarButton>
    </>
  }
/>`,
        language: "tsx",
      },
    },
  },
}

export const Minimal: Story = {
  args: {
    leftSlot: <HicLogo compact src="./logo.svg" />,
  },
  parameters: {
    docs: {
      source: {
        code: `<Navbar leftSlot={<HicLogo compact />} />`,
        language: "tsx",
      },
    },
  },
}
