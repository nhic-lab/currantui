/**
 * Recipe: App Shell
 *
 * Copy-paste starting point for a full NHIC application layout. Replace the
 * plain `<a href>` elements with your router's link via `asChild` and drive
 * `isActive` from your router state — the shell never inspects routes.
 */
import {
  BellIcon,
  ChartBarIcon,
  GearIcon,
  HouseIcon,
  SquaresFourIcon,
  TableIcon,
} from "@phosphor-icons/react"

import { Card, CardContent, CardHeader, CardTitle } from "@nhic/currantui/components/card"
import { HicLogo } from "@nhic/currantui/components/hic-logo"
import { LabeledValue } from "@nhic/currantui/components/labeled-value"
import { PageHeader } from "@nhic/currantui/components/page-header"
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
import { Toaster } from "@nhic/currantui/components/sonner"
import { ThemeToggle } from "@nhic/currantui/components/theme-toggle"

import type { Meta, StoryObj } from "@storybook/react-vite"

/* Element constant (not a component) so the docs snippet expands the tree */
const appShell = (
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
      <ShellSideNavItems>
        <ShellSideNavLink href="#" icon={<HouseIcon />} isActive>
          Overview
        </ShellSideNavLink>
        <ShellSideNavLink href="#" icon={<ChartBarIcon />}>
          Indicators
        </ShellSideNavLink>
        <ShellSideNavMenu label="Reports" icon={<TableIcon />} defaultOpen>
          <ShellSideNavMenuItem href="#">
            Weekly submissions
          </ShellSideNavMenuItem>
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
    </ShellSideNav>
    <ShellContent>
      <div className="flex flex-col gap-4 p-4">
        <PageHeader
          title="Facility coverage"
          subtitle="Weekly reporting across all districts"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>This week</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-6">
              <LabeledValue label="Facilities">478</LabeledValue>
              <LabeledValue label="On time">412</LabeledValue>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completeness</CardTitle>
            </CardHeader>
            <CardContent>
              <LabeledValue label="Validated">98.2%</LabeledValue>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Open signals</CardTitle>
            </CardHeader>
            <CardContent>
              <LabeledValue label="Requiring review">3</LabeledValue>
            </CardContent>
          </Card>
        </div>
        <div className="h-64 rounded-lg border border-dashed border-border" />
      </div>
    </ShellContent>
    <Toaster />
  </ShellProvider>
)

const meta = {
  title: "Recipes/App Shell",
  component: ShellProvider,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ShellProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => appShell,
}
