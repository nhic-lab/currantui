import { BellIcon, Gear, MagnifyingGlassIcon, SignOut } from "@phosphor-icons/react"
import { userEvent, within } from "storybook/test"

import { HicLogo } from "@nhic/currantui/components/hic-logo"
import { ShellProvider } from "@nhic/currantui/components/shell"
import {
  ShellGlobalAction,
  ShellGlobalBar,
  ShellHeader,
  ShellHeaderName,
  ShellHeaderNav,
  ShellHeaderNavLink,
  ShellHeaderNavMenu,
  ShellHeaderNavMenuItem,
} from "@nhic/currantui/components/shell-header"
import {
  AvatarButton,
  AvatarButtonItem,
  AvatarButtonLabel,
  AvatarButtonMenu,
  AvatarButtonSeparator,
  AvatarButtonTrigger,
} from "@nhic/currantui/components/avatar-button"
import { ThemeToggle } from "@nhic/currantui/components/theme-toggle"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Shell/Header",
  component: ShellHeader,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ShellHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ShellProvider className="min-h-24">
      <ShellHeader>
        <ShellHeaderName href="#">
          <HicLogo />
        </ShellHeaderName>
        <ShellHeaderNav>
          <ShellHeaderNavLink href="#" isActive>
            Surveillance
          </ShellHeaderNavLink>
          <ShellHeaderNavLink href="#">Registry</ShellHeaderNavLink>
        </ShellHeaderNav>
        <ShellGlobalBar>
          <ShellGlobalAction label="Search">
            <MagnifyingGlassIcon />
          </ShellGlobalAction>
          <ShellGlobalAction label="Notifications">
            <BellIcon />
          </ShellGlobalAction>
          <ThemeToggle />
          <AvatarButton>
            <AvatarButtonTrigger name="Bellamy Dan" />
            <AvatarButtonMenu>
              <AvatarButtonLabel name="Bellamy Dan" email="analyst@example.test" />
              <AvatarButtonSeparator />
              <AvatarButtonItem icon={Gear}>Settings</AvatarButtonItem>
              <AvatarButtonSeparator />
              <AvatarButtonItem icon={SignOut} destructive onSelect={() => {}}>
                Sign out
              </AvatarButtonItem>
            </AvatarButtonMenu>
          </AvatarButton>
        </ShellGlobalBar>
      </ShellHeader>
    </ShellProvider>
  ),
}

export const WithSubmenu: Story = {
  render: () => (
    <ShellProvider className="min-h-48">
      <ShellHeader>
        <ShellHeaderName href="#">
          <HicLogo />
        </ShellHeaderName>
        <ShellHeaderNav>
          <ShellHeaderNavLink href="#">Surveillance</ShellHeaderNavLink>
          <ShellHeaderNavMenu label="Analytics">
            <ShellHeaderNavMenuItem asChild>
              <a href="#">Dashboards</a>
            </ShellHeaderNavMenuItem>
            <ShellHeaderNavMenuItem asChild isActive>
              <a href="#">Exports</a>
            </ShellHeaderNavMenuItem>
          </ShellHeaderNavMenu>
        </ShellHeaderNav>
      </ShellHeader>
    </ShellProvider>
  ),
  parameters: {
    a11y: {
      config: {
        // Radix DropdownMenu marks the page background aria-hidden while
        // open, which axe flags because the focusable trigger sits inside it
        // (library-level interplay, not story authoring)
        rules: [{ id: "aria-hidden-focus", enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Analytics" }))
    // Items render in a portal outside the canvas root
    await within(document.body).findByRole("menuitem", { name: "Dashboards" })
  },
}
