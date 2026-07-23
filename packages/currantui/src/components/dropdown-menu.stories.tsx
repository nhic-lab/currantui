import {
  DotsThreeVerticalIcon,
  DownloadSimpleIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@nhic/currantui/components/dropdown-menu"
import { Button } from "@nhic/currantui/components/button"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component:
          "One primitive for every press-triggered menu — action menus, overflow menus, menu buttons: compose any trigger via `asChild`.",
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

const template = (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">Actions</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <PencilSimpleIcon />
          Edit record
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DownloadSimpleIcon />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Share with</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>District office</DropdownMenuItem>
            <DropdownMenuItem>Provincial office</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <TrashIcon />
        Delete record
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

export const Default: Story = {
  render: () => template,
}

export const Open: Story = {
  render: () => template,
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
    await userEvent.click(
      await canvas.findByRole("button", { name: "Actions" })
    )
    // Items render in a portal outside the canvas root
    await within(document.body).findByRole("menuitem", { name: "Export CSV" })
  },
}

export const IconTrigger: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="More actions">
          <DotsThreeVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit record</DropdownMenuItem>
        <DropdownMenuItem>Export CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Selection: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked>Facility</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>District</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Last submission</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Density</DropdownMenuLabel>
        <DropdownMenuRadioGroup value="compact">
          <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="comfortable">
            Comfortable
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const OverflowingSubmenu: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Export</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Download</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Districts</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {Array.from({ length: 40 }, (_, index) => (
              <DropdownMenuItem key={index}>
                District {index + 1}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
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
    const body = canvasElement.ownerDocument.body
    const screen = within(body)
    const subTrigger = await screen.findByRole("menuitem", {
      name: "Districts",
    })
    subTrigger.focus()
    await userEvent.keyboard("{ArrowRight}")
    const subContent = await waitFor(() => {
      const el = body.querySelector<HTMLElement>(
        '[data-slot="dropdown-menu-sub-content"]'
      )
      expect(el).not.toBeNull()
      return el!
    })
    const rect = subContent.getBoundingClientRect()
    expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight + 1)
    expect(subContent.scrollHeight).toBeGreaterThan(subContent.clientHeight)
  },
}
