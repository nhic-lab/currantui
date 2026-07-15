import { MapPinIcon } from "@phosphor-icons/react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { ListView, ListViewItem } from "@nhic/currantui/components/list-view"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/ListView",
  component: ListView,
  parameters: {
    docs: {
      description: {
        component:
          "Keyboard-navigable row collection with optional selection. For tabular data use the table family; for card layouts use CardView.",
      },
    },
  },
} satisfies Meta<typeof ListView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ListView aria-label="Facilities" className="w-80">
      <ListViewItem id="hf-0042">
        <MapPinIcon />
        Kigali Central
      </ListViewItem>
      <ListViewItem id="hf-0107">
        <MapPinIcon />
        Gasabo District Hospital
      </ListViewItem>
      <ListViewItem id="hf-0233">
        <MapPinIcon />
        Musanze Health Center
      </ListViewItem>
    </ListView>
  ),
}

export const MultipleSelection: Story = {
  render: () => (
    <ListView
      aria-label="Facilities"
      selectionMode="multiple"
      defaultSelectedKeys={["hf-0042"]}
      className="w-80"
    >
      <ListViewItem id="hf-0042" textValue="Kigali Central">
        Kigali Central
      </ListViewItem>
      <ListViewItem id="hf-0107" textValue="Gasabo District Hospital">
        Gasabo District Hospital
      </ListViewItem>
      <ListViewItem id="hf-0233" textValue="Musanze Health Center">
        Musanze Health Center
      </ListViewItem>
    </ListView>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByRole("row", { name: /musanze/i })
    await userEvent.click(row)
    await waitFor(() => expect(row).toHaveAttribute("aria-selected", "true"))
  },
}

export const WithDisabledItem: Story = {
  render: () => (
    <ListView
      aria-label="Facilities"
      selectionMode="single"
      disabledKeys={["hf-0233"]}
      className="w-80"
    >
      <ListViewItem id="hf-0042" textValue="Kigali Central">
        Kigali Central
      </ListViewItem>
      <ListViewItem id="hf-0233" textValue="Musanze Health Center (closed)">
        Musanze Health Center (closed)
      </ListViewItem>
    </ListView>
  ),
}

export const Empty: Story = {
  render: () => (
    <ListView
      aria-label="Facilities"
      renderEmptyState={() => "No facilities match the current filters."}
      className="w-80"
    >
      {[]}
    </ListView>
  ),
}
