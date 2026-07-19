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
  parameters: {
    layout: "fullscreen",
    /* Every variant hardcodes id="shell-side-nav" — inline docs rendering
       would duplicate it across stories; isolate each in an iframe. */
    docs: { story: { inline: false, iframeHeight: 420 } },
  },
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
      <ShellSideNav variant="rail">
        <ShellSideNavItems>
          <ShellSideNavLink href="#" icon={<HouseIcon />} isActive>
            Overview
          </ShellSideNavLink>
          <ShellSideNavLink href="#" icon={<ChartBarIcon />}>
            Indicators
          </ShellSideNavLink>
          <ShellSideNavMenu label="Reports" icon={<TableIcon />} defaultOpen>
            <ShellSideNavMenuItem href="#">Weekly submissions</ShellSideNavMenuItem>
            <ShellSideNavMenuItem href="#">Data quality</ShellSideNavMenuItem>
          </ShellSideNavMenu>
          <ShellSideNavDivider />
          <ShellSideNavLink href="#" icon={<GearIcon />}>
            Administration
          </ShellSideNavLink>
        </ShellSideNavItems>
      </ShellSideNav>
    </ShellProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const labels = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="shell-side-nav-label"]'
    )
    // Every library-rendered label (links, menu trigger, open menu items) is
    // tagged; at rail rest none may paint, or their first glyphs bleed out.
    expect(labels.length).toBeGreaterThanOrEqual(6)
    for (const label of labels) {
      expect(getComputedStyle(label).opacity).toBe("0")
    }
    canvas.getByRole("link", { name: "Overview" }).focus()
    await waitFor(() => {
      for (const label of labels) {
        expect(getComputedStyle(label).opacity).toBe("1")
      }
    })
  },
}

export const LabeledRail: Story = {
  render: () => (
    <ShellProvider className="min-h-96">
      <ShellSideNav variant="labeled-rail" label="Primary">
        <ShellSideNavItems>
          <ShellSideNavLink href="#" icon={<HouseIcon />} isActive>
            Home
          </ShellSideNavLink>
          <ShellSideNavLink href="#" icon={<ChartBarIcon />}>
            Reports
          </ShellSideNavLink>
          <ShellSideNavLink href="#" icon={<TableIcon />}>
            OneLake catalog
          </ShellSideNavLink>
          <ShellSideNavMenu label="Legacy menu" icon={<TableIcon />}>
            <ShellSideNavMenuItem href="#">Hidden</ShellSideNavMenuItem>
          </ShellSideNavMenu>
          <ShellSideNavDivider />
          <ShellSideNavLink href="#" icon={<GearIcon />}>
            Settings
          </ShellSideNavLink>
        </ShellSideNavItems>
        <ShellSideNavFooter>
          {/* Footer already pads horizontally — nested lists must not pad again */}
          <ShellSideNavItems className="flex-none px-0">
            <ShellSideNavLink href="#" icon={<HouseIcon />}>
              My workspace
            </ShellSideNavLink>
          </ShellSideNavItems>
        </ShellSideNavFooter>
      </ShellSideNav>
    </ShellProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvasElement.querySelector('[data-slot="shell-side-nav"]')!
    await expect(nav).toHaveAttribute("data-variant", "labeled-rail")
    const home = canvas.getByRole("link", { name: "Home" })
    await expect(home).toHaveAttribute("aria-current", "page")
    expect(getComputedStyle(home).flexDirection).toBe("column")
    const label = home.querySelector('[data-slot="shell-side-nav-label"]')!
    expect(getComputedStyle(label).opacity).toBe("1")
    await expect(
      canvas.queryByRole("button", { name: "Legacy menu" })
    ).not.toBeInTheDocument()
    // Long unbreakable labels must stay inside the row (hover bg must cover them)
    const workspace = canvas.getByRole("link", { name: "My workspace" })
    const workspaceLabel = workspace.querySelector<HTMLElement>(
      '[data-slot="shell-side-nav-label"]'
    )!
    expect(workspaceLabel.scrollWidth).toBeLessThanOrEqual(
      workspaceLabel.clientWidth + 1
    )
    expect(workspace.getBoundingClientRect().right).toBeLessThanOrEqual(
      nav.getBoundingClientRect().right + 0.5
    )
    // Footer rows must get the same box as main rows (no double padding)
    expect(workspace.getBoundingClientRect().width).toBeCloseTo(
      home.getBoundingClientRect().width,
      0
    )
  },
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
