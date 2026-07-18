import {
  BellIcon,
  ChartBarIcon,
  GearIcon,
  HouseIcon,
  SquaresFourIcon,
  TableIcon,
} from "@phosphor-icons/react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  ShellContent,
  ShellProvider,
  ShellSkipToContent,
} from "@nhic/currantui/components/shell"
import {
  ShellGlobalAction,
  ShellGlobalBar,
  ShellHeader,
  ShellHeaderMenuButton,
  ShellHeaderName,
  ShellHeaderNav,
  ShellHeaderNavLink,
  ShellHeaderNavMenu,
  ShellHeaderNavMenuItem,
} from "@nhic/currantui/components/shell-header"
import {
  ShellPanel,
  ShellSwitcher,
  ShellSwitcherDivider,
  ShellSwitcherItem,
} from "@nhic/currantui/components/shell-panel"
import {
  ShellSideNav,
  ShellSideNavDivider,
  ShellSideNavFooter,
  ShellSideNavItems,
  ShellSideNavLink,
  ShellSideNavMenu,
  ShellSideNavMenuItem,
} from "@nhic/currantui/components/shell-side-nav"
import { HicLogo } from "@nhic/currantui/components/hic-logo"
import { PageHeader } from "@nhic/currantui/components/page-header"
import { ThemeToggle } from "@nhic/currantui/components/theme-toggle"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Shell",
  component: ShellProvider,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Application chassis: header, side navigation (expandable / rail / fixed), exclusive right panels, and content area. State lives in ShellProvider (`useShell()`); Mod+B toggles the side nav.",
      },
    },
  },
  argTypes: {
    open: { table: { disable: true } },
    keyboardShortcut: { table: { disable: true } },
  },
} satisfies Meta<typeof ShellProvider>

export default meta
type Story = StoryObj<typeof meta>

/* Element constants (not components) so docs snippets expand their trees */
const demoSideNavContent = (
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
)

const demoContent = (
  <ShellContent>
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 p-4">
      <PageHeader
        title="Facility coverage"
        subtitle="Weekly reporting across all districts"
      />
      <div className="h-64 rounded-lg border border-dashed border-border" />
    </div>
  </ShellContent>
)

const fullChassis = (
  <ShellProvider>
    <ShellSkipToContent />
    <ShellHeader>
      <ShellHeaderMenuButton />
      <ShellHeaderName href="#">
        <HicLogo />
      </ShellHeaderName>
      <ShellHeaderNav>
        <ShellHeaderNavLink href="#" isActive>
          Surveillance
        </ShellHeaderNavLink>
        <ShellHeaderNavLink href="#">Registry</ShellHeaderNavLink>
        <ShellHeaderNavMenu label="Analytics">
          <ShellHeaderNavMenuItem asChild>
            <a href="#">Dashboards</a>
          </ShellHeaderNavMenuItem>
          <ShellHeaderNavMenuItem asChild>
            <a href="#">Exports</a>
          </ShellHeaderNavMenuItem>
        </ShellHeaderNavMenu>
      </ShellHeaderNav>
      <ShellGlobalBar>
        <ShellGlobalAction label="Notifications">
          <BellIcon />
        </ShellGlobalAction>
        <ThemeToggle />
        <ShellGlobalAction label="Switch product" panelId="switcher">
          <SquaresFourIcon />
        </ShellGlobalAction>
      </ShellGlobalBar>
      <ShellPanel id="switcher" label="Switch product">
        <ShellSwitcher>
          <ShellSwitcherItem href="#" isActive>
            Surveillance
          </ShellSwitcherItem>
          <ShellSwitcherItem href="#">Facility registry</ShellSwitcherItem>
          <ShellSwitcherDivider />
          <ShellSwitcherItem href="#">Admin console</ShellSwitcherItem>
        </ShellSwitcher>
      </ShellPanel>
    </ShellHeader>
    <ShellSideNav>
      {demoSideNavContent}
      <ShellSideNavFooter>
        <p className="px-2 pb-1 text-[0.625rem] text-sidebar-foreground/70 tabular-nums">
          CurrantUI v0.3.0
        </p>
      </ShellSideNavFooter>
    </ShellSideNav>
    {demoContent}
  </ShellProvider>
)

export const Default: Story = {
  render: () => fullChassis,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const shell = canvasElement.querySelector('[data-slot="shell"]')
    const hamburger = canvas.getByRole("button", { name: /navigation/i })

    await userEvent.click(hamburger)
    await waitFor(() =>
      expect(shell).toHaveAttribute("data-state", "collapsed")
    )
    await userEvent.click(hamburger)
    await waitFor(() =>
      expect(shell).toHaveAttribute("data-state", "expanded")
    )
  },
}

export const Rail: Story = {
  render: () => (
    <ShellProvider>
      <ShellSkipToContent />
      <ShellHeader>
        <ShellHeaderName href="#">
          <HicLogo />
        </ShellHeaderName>
        <ShellGlobalBar>
          <ThemeToggle />
        </ShellGlobalBar>
      </ShellHeader>
      <ShellSideNav variant="rail">
        {demoSideNavContent}
      </ShellSideNav>
      {demoContent}
    </ShellProvider>
  ),
  play: async ({ canvasElement }) => {
    // Tabbing into the rail expands it via focus-within — labels become visible
    await userEvent.tab() // skip link
    await userEvent.tab() // header name
    await userEvent.tab() // theme toggle
    await userEvent.tab() // first side-nav link
    const canvas = within(canvasElement)
    const link = canvas.getByRole("link", { name: "Overview" })
    await waitFor(() => expect(link).toHaveFocus())
  },
}

export const LabeledRail: Story = {
  render: () => (
    <ShellProvider>
      <ShellSkipToContent />
      <ShellHeader>
        <ShellHeaderName href="#">
          <HicLogo />
        </ShellHeaderName>
        <ShellGlobalBar>
          <ThemeToggle />
        </ShellGlobalBar>
      </ShellHeader>
      <ShellSideNav variant="labeled-rail">
        <ShellSideNavItems>
          <ShellSideNavLink href="#" icon={<HouseIcon />} isActive>
            Home
          </ShellSideNavLink>
          <ShellSideNavLink href="#" icon={<ChartBarIcon />}>
            Reports
          </ShellSideNavLink>
          <ShellSideNavLink href="#" icon={<TableIcon />}>
            Datasets
          </ShellSideNavLink>
          <ShellSideNavDivider />
          <ShellSideNavLink href="#" icon={<GearIcon />}>
            Settings
          </ShellSideNavLink>
        </ShellSideNavItems>
        <ShellSideNavFooter>
          <ShellSideNavItems className="flex-none px-0">
            <ShellSideNavLink href="#" icon={<SquaresFourIcon />}>
              My workspace
            </ShellSideNavLink>
          </ShellSideNavItems>
        </ShellSideNavFooter>
      </ShellSideNav>
      {demoContent}
    </ShellProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvasElement.querySelector('[data-slot="shell-side-nav"]')!
    await expect(nav).toHaveAttribute("data-variant", "labeled-rail")
    const workspace = canvas.getByRole("link", { name: "My workspace" })
    const home = canvas.getByRole("link", { name: "Home" })
    // Inside the shell grid the rail keeps its width and rows stay uniform
    expect(workspace.getBoundingClientRect().width).toBeCloseTo(
      home.getBoundingClientRect().width,
      0
    )
    expect(workspace.getBoundingClientRect().right).toBeLessThanOrEqual(
      nav.getBoundingClientRect().right + 0.5
    )
  },
}

export const Fixed: Story = {
  render: () => (
    <ShellProvider>
      <ShellSkipToContent />
      <ShellHeader>
        <ShellHeaderName href="#">
          <HicLogo />
        </ShellHeaderName>
      </ShellHeader>
      <ShellSideNav variant="fixed">
        {demoSideNavContent}
      </ShellSideNav>
      {demoContent}
    </ShellProvider>
  ),
}

export const MobileOverlay: Story = {
  render: () => fullChassis,
  // Viewport switching mid-run crashes the vitest browser page — view this
  // story in the Storybook UI (mobile viewport) instead; the mobile sheet
  // behavior itself is exercised by Radix Dialog primitives
  tags: ["!test"],
  globals: {
    viewport: { value: "mobile", isRotated: false },
  },
}

export const PanelExclusivity: Story = {
  render: () => (
    <ShellProvider>
      <ShellSkipToContent />
      <ShellHeader>
        <ShellHeaderName href="#">
          <HicLogo />
        </ShellHeaderName>
        <ShellGlobalBar>
          <ShellGlobalAction label="Notifications" panelId="notifications">
            <BellIcon />
          </ShellGlobalAction>
          <ShellGlobalAction label="Switch product" panelId="switcher">
            <SquaresFourIcon />
          </ShellGlobalAction>
        </ShellGlobalBar>
        <ShellPanel id="notifications" label="Notifications">
          <p className="p-4 text-xs/relaxed text-sidebar-foreground/70">
            No unread notifications.
          </p>
        </ShellPanel>
        <ShellPanel id="switcher" label="Switch product">
          <ShellSwitcher>
            <ShellSwitcherItem href="#">Surveillance</ShellSwitcherItem>
            <ShellSwitcherItem href="#">Facility registry</ShellSwitcherItem>
          </ShellSwitcher>
        </ShellPanel>
      </ShellHeader>
      {demoContent}
    </ShellProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const notifications = canvas.getByRole("button", { name: "Notifications" })
    const switcher = canvas.getByRole("button", { name: "Switch product" })

    await userEvent.click(notifications)
    await waitFor(() =>
      expect(notifications).toHaveAttribute("aria-expanded", "true")
    )

    await userEvent.click(switcher)
    await waitFor(() => {
      expect(notifications).toHaveAttribute("aria-expanded", "false")
      expect(switcher).toHaveAttribute("aria-expanded", "true")
    })

    // End neutral so axe audits the settled DOM (re-click toggles closed)
    await userEvent.click(switcher)
    await waitFor(() =>
      expect(switcher).toHaveAttribute("aria-expanded", "false")
    )
  },
}

export const SkipToContent: Story = {
  render: () => fullChassis,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const skipLink = canvas.getByRole("link", {
      name: "Skip to main content",
    })
    await waitFor(() => expect(skipLink).toHaveFocus())
    // Activating the anchor is plain hash navigation — following it reloads
    // the vitest tester iframe, so assert the target wiring instead
    expect(skipLink).toHaveAttribute("href", "#main-content")
    expect(canvas.getByRole("main")).toHaveAttribute("id", "main-content")
    await userEvent.tab()
    await waitFor(() => expect(skipLink).not.toHaveFocus())
  },
}
