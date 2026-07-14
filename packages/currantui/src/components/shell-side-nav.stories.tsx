import {
  ChartBarIcon,
  GearIcon,
  HouseIcon,
  TableIcon,
} from "@phosphor-icons/react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { ShellProvider } from "@nhic/currantui/components/shell"
import {
  ShellSideNav,
  ShellSideNavDivider,
  ShellSideNavFooter,
  ShellSideNavItems,
  ShellSideNavLink,
  ShellSideNavMenu,
  ShellSideNavMenuItem,
} from "@nhic/currantui/components/shell-side-nav"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Shell/SideNav",
  component: ShellSideNav,
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: {
      control: "select",
      options: ["expandable", "rail", "fixed"],
    },
  },
} satisfies Meta<typeof ShellSideNav>

export default meta
type Story = StoryObj<typeof meta>

const items = (
  <>
    <ShellSideNavItems>
      <ShellSideNavLink href="#" icon={<HouseIcon />} isActive>
        Overview
      </ShellSideNavLink>
      <ShellSideNavLink href="#" icon={<ChartBarIcon />}>
        Indicators
      </ShellSideNavLink>
      <ShellSideNavMenu label="Reports" icon={<TableIcon />}>
        <ShellSideNavMenuItem href="#">Weekly submissions</ShellSideNavMenuItem>
        <ShellSideNavMenuItem href="#">Data quality</ShellSideNavMenuItem>
      </ShellSideNavMenu>
      <ShellSideNavDivider />
      <ShellSideNavLink href="#" icon={<GearIcon />}>
        Administration
      </ShellSideNavLink>
    </ShellSideNavItems>
    <ShellSideNavFooter>
      <p className="px-2 pb-1 text-[0.625rem] text-sidebar-foreground/70 tabular-nums">
        CurrantUI v0.3.0
      </p>
    </ShellSideNavFooter>
  </>
)

export const Fixed: Story = {
  render: () => (
    <ShellProvider className="min-h-96">
      <ShellSideNav variant="fixed">{items}</ShellSideNav>
    </ShellProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: "Reports" })
    await userEvent.click(trigger)
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true")
    )
    await canvas.findByRole("link", { name: "Weekly submissions" })
  },
}

export const Rail: Story = {
  render: () => (
    <ShellProvider className="min-h-96">
      <ShellSideNav variant="rail">{items}</ShellSideNav>
    </ShellProvider>
  ),
}

export const MenuOpen: Story = {
  render: () => (
    <ShellProvider className="min-h-96">
      <ShellSideNav variant="fixed">
        <ShellSideNavItems>
          <ShellSideNavLink href="#" icon={<HouseIcon />}>
            Overview
          </ShellSideNavLink>
          <ShellSideNavMenu label="Reports" icon={<TableIcon />} defaultOpen>
            <ShellSideNavMenuItem href="#" isActive>
              Weekly submissions
            </ShellSideNavMenuItem>
            <ShellSideNavMenuItem href="#">Data quality</ShellSideNavMenuItem>
          </ShellSideNavMenu>
        </ShellSideNavItems>
      </ShellSideNav>
    </ShellProvider>
  ),
}
