import * as React from "react"

import {
  ChartBarIcon,
  DownloadSimpleIcon,
  GearIcon,
  HouseIcon,
  TableIcon,
} from "@phosphor-icons/react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@nhic/currantui/components/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@nhic/currantui/components/command"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Command",
  component: Command,
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

const items = (
  <>
    <CommandGroup heading="Navigate">
      <CommandItem>
        <HouseIcon />
        Overview
        <CommandShortcut>G O</CommandShortcut>
      </CommandItem>
      <CommandItem>
        <ChartBarIcon />
        Indicators
      </CommandItem>
      <CommandItem>
        <TableIcon />
        Weekly reports
      </CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Actions">
      <CommandItem>
        <DownloadSimpleIcon />
        Export CSV
        <CommandShortcut>⌘E</CommandShortcut>
      </CommandItem>
      <CommandItem>
        <GearIcon />
        Open settings
      </CommandItem>
    </CommandGroup>
  </>
)

export const Default: Story = {
  render: () => (
    <Command label="Search commands" className="w-80 border border-border">
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {items}
      </CommandList>
    </Command>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole("combobox", { name: "Search commands" }),
      "export"
    )
    await canvas.findByText("Export CSV")
    await waitFor(() =>
      expect(canvas.queryByText("Open settings")).not.toBeInTheDocument()
    )
  },
}

function DialogDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {items}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export const Dialog: Story = {
  render: () => <DialogDemo />,
  parameters: {
    a11y: {
      config: {
        // Radix Dialog marks the page background aria-hidden while open,
        // which axe flags because the focusable trigger sits inside it
        // (library-level interplay, not story authoring)
        rules: [{ id: "aria-hidden-focus", enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Open command palette" })
    )
    // Content renders in a portal outside the canvas root
    await within(document.body).findByText("Weekly reports")
  },
}
