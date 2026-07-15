import * as React from "react"

import { DownloadSimpleIcon, FolderIcon, TableIcon, TrashIcon } from "@phosphor-icons/react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { ActionBar } from "@nhic/currantui/components/action-bar"
import { Button } from "@nhic/currantui/components/button"
import { ListView, ListViewItem } from "@nhic/currantui/components/list-view"
import { Separator } from "@nhic/currantui/components/separator"
import { TreeView, TreeViewItem } from "@nhic/currantui/components/tree-view"

import type { Selection } from "react-aria-components"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/ActionBar",
  component: ActionBar,
  parameters: {
    docs: {
      description: {
        component:
          "Bulk-actions bar for any selectable collection — renders nothing until items are selected. Defaults to overlaying the bottom of a `relative` container; pass `className=\"static\"` to place it in flow, as these demos do. TableSelectionBar remains the attached banner for tables.",
      },
    },
  },
  args: {
    count: 0,
    onClearSelection: () => {},
  },
  argTypes: {
    count: { table: { disable: true } },
    onClearSelection: { table: { disable: true } },
  },
} satisfies Meta<typeof ActionBar>

export default meta
type Story = StoryObj<typeof meta>

const FACILITIES = [
  { id: "hf-0042", name: "Kigali Central" },
  { id: "hf-0107", name: "Gasabo District Hospital" },
  { id: "hf-0233", name: "Musanze Health Center" },
  { id: "hf-0301", name: "Huye Referral Hospital" },
]

function ListViewDemo() {
  const [selected, setSelected] = React.useState<Selection>(new Set())
  const count = selected === "all" ? FACILITIES.length : selected.size

  return (
    <div className="w-80">
      <ListView
        aria-label="Facilities"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        {FACILITIES.map((facility) => (
          <ListViewItem
            key={facility.id}
            id={facility.id}
            textValue={facility.name}
          >
            {facility.name}
          </ListViewItem>
        ))}
      </ListView>
      {count > 0 && <Separator className="mt-2" />}
      <ActionBar
        count={count}
        onClearSelection={() => setSelected(new Set())}
        className="static mt-2"
      >
        <Button variant="ghost" size="sm">
          <DownloadSimpleIcon data-icon="inline-start" />
          Export
        </Button>
        <Button variant="destructive" size="sm">
          <TrashIcon data-icon="inline-start" />
          Delete
        </Button>
      </ActionBar>
    </div>
  )
}

export const WithListView: Story = {
  render: () => <ListViewDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("row", { name: /kigali central/i }))
    await userEvent.click(canvas.getByRole("row", { name: /musanze/i }))
    await canvas.findByText("2 selected")

    await userEvent.click(
      canvas.getByRole("button", { name: "Clear selection" })
    )
    await waitFor(() =>
      expect(canvas.queryByText("2 selected")).not.toBeInTheDocument()
    )
  },
}

function TreeViewDemo() {
  const [selected, setSelected] = React.useState<Selection>(new Set())
  const count = selected === "all" ? 5 : selected.size

  return (
    <div className="w-80">
      <TreeView
        aria-label="Report folders"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        defaultExpandedKeys={["kigali", "gasabo"]}
      >
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
          <TreeViewItem
            id="kicukiro-weekly"
            title="Kicukiro weekly"
            icon={<TableIcon />}
          />
        </TreeViewItem>
      </TreeView>
      <ActionBar
        count={count}
        onClearSelection={() => setSelected(new Set())}
        className="static mt-3"
      >
        <Button variant="ghost" size="sm">
          <DownloadSimpleIcon data-icon="inline-start" />
          Export
        </Button>
      </ActionBar>
    </div>
  )
}

export const WithTreeView: Story = {
  render: () => <TreeViewDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole("row", { name: /weekly submissions/i })
    )
    await canvas.findByText("1 selected")
  },
}
