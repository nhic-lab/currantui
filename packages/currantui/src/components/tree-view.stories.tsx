import { FolderIcon, TableIcon } from "@phosphor-icons/react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { TreeView, TreeViewItem } from "@nhic/currantui/components/tree-view"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/TreeView",
  component: TreeView,
} satisfies Meta<typeof TreeView>

export default meta
type Story = StoryObj<typeof meta>

const tree = (
  <>
    <TreeViewItem id="kigali" title="Kigali City" icon={<FolderIcon />}>
      <TreeViewItem id="gasabo" title="Gasabo" icon={<FolderIcon />}>
        <TreeViewItem
          id="gasabo-weekly"
          title="Weekly submissions"
          icon={<TableIcon />}
        />
        <TreeViewItem
          id="gasabo-quality"
          title="Data quality"
          icon={<TableIcon />}
        />
      </TreeViewItem>
      <TreeViewItem id="kicukiro" title="Kicukiro" icon={<FolderIcon />}>
        <TreeViewItem
          id="kicukiro-weekly"
          title="Weekly submissions"
          icon={<TableIcon />}
        />
      </TreeViewItem>
    </TreeViewItem>
    <TreeViewItem id="north" title="Northern Province" icon={<FolderIcon />}>
      <TreeViewItem id="musanze" title="Musanze" icon={<FolderIcon />}>
        <TreeViewItem
          id="musanze-weekly"
          title="Weekly submissions"
          icon={<TableIcon />}
        />
      </TreeViewItem>
    </TreeViewItem>
  </>
)

export const Default: Story = {
  render: () => (
    <TreeView
      aria-label="Report folders"
      defaultExpandedKeys={["kigali"]}
      className="w-72"
    >
      {tree}
    </TreeView>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gasabo = canvas.getByRole("row", { name: /^gasabo$/i })

    await expect(gasabo).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(within(gasabo).getByRole("button"))
    await waitFor(() =>
      expect(gasabo).toHaveAttribute("aria-expanded", "true")
    )
    await canvas.findByRole("row", { name: /data quality/i })
  },
}

export const ExpandedSelection: Story = {
  render: () => (
    <TreeView
      aria-label="Report folders"
      selectionMode="single"
      defaultExpandedKeys={["kigali", "gasabo", "north", "musanze"]}
      defaultSelectedKeys={["gasabo-weekly"]}
      className="w-72"
    >
      {tree}
    </TreeView>
  ),
}

export const WithDisabledBranch: Story = {
  render: () => (
    <TreeView
      aria-label="Report folders"
      disabledKeys={["north"]}
      defaultExpandedKeys={["kigali"]}
      className="w-72"
    >
      {tree}
    </TreeView>
  ),
}
