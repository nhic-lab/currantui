import { SquaresFourIcon } from "@phosphor-icons/react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { HicLogo } from "@nhic/currantui/components/hic-logo"
import { ShellProvider } from "@nhic/currantui/components/shell"
import {
  ShellGlobalAction,
  ShellGlobalBar,
  ShellHeader,
  ShellHeaderName,
} from "@nhic/currantui/components/shell-header"
import {
  ShellPanel,
  ShellSwitcher,
  ShellSwitcherDivider,
  ShellSwitcherItem,
} from "@nhic/currantui/components/shell-panel"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Shell/Panel",
  component: ShellPanel,
  parameters: { layout: "fullscreen" },
  args: {
    id: "switcher",
    label: "Switch product",
  },
  argTypes: {
    id: { table: { disable: true } },
  },
} satisfies Meta<typeof ShellPanel>

export default meta
type Story = StoryObj<typeof meta>

const switcherSource = `<ShellProvider>
  <ShellHeader>
    <ShellHeaderName href="#">
      <HicLogo />
    </ShellHeaderName>
    <ShellGlobalBar>
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
</ShellProvider>`

export const Switcher: Story = {
  render: () => (
    <ShellProvider className="min-h-96">
      <ShellHeader>
        <ShellHeaderName href="#">
          {/* Page-relative: the deployed Storybook lives under a subpath */}
          <HicLogo src="./logo.svg" />
        </ShellHeaderName>
        <ShellGlobalBar>
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
    </ShellProvider>
  ),
  parameters: {
    docs: { source: { code: switcherSource, language: "tsx" } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: "Switch product" })

    await userEvent.click(trigger)
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true")
    )
    await canvas.findByRole("link", { name: "Facility registry" })

    await userEvent.click(trigger)
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "false")
    )
  },
}
