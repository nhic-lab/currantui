import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  DashboardGrid,
  DashboardWidget,
} from "@nhic/currantui/components/dashboard-grid"
import { WidgetToolbar } from "@nhic/currantui/components/dashboard-widget-chrome"
import { Button } from "@nhic/currantui/components/button"
import { LabeledValue } from "@nhic/currantui/components/labeled-value"
import type { LayoutItem } from "@nhic/currantui/lib/grid-layout"
import type { DashboardGridHandle } from "@nhic/currantui/components/dashboard-grid"

import type { Meta, StoryObj } from "@storybook/react-vite"

const baseLayout: Array<LayoutItem> = [
  { id: "facilities", x: 0, y: 0, w: 3, h: 2 },
  { id: "on-time", x: 3, y: 0, w: 3, h: 2 },
  { id: "submissions", x: 6, y: 0, w: 6, h: 4 },
  { id: "districts", x: 0, y: 2, w: 6, h: 2 },
]

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <LabeledValue label={label}>
      <span className="font-heading text-2xl font-semibold tracking-tight">
        {value}
      </span>
    </LabeledValue>
  )
}

function widgets(withToolbar = false) {
  return [
    <DashboardWidget
      key="facilities"
      id="facilities"
      title="Facilities"
      toolbar={withToolbar ? <WidgetToolbar /> : undefined}
    >
      <Stat label="Reporting this week" value="412" />
    </DashboardWidget>,
    <DashboardWidget key="on-time" id="on-time" title="On-time reports">
      <Stat label="On time this week" value="94%" />
    </DashboardWidget>,
    <DashboardWidget key="submissions" id="submissions" title="Weekly submissions">
      <div className="grid h-full place-items-center text-sm text-muted-foreground">
        Chart slot
      </div>
    </DashboardWidget>,
    <DashboardWidget key="districts" id="districts" title="Facilities by district">
      <div className="grid h-full place-items-center text-sm text-muted-foreground">
        Table slot
      </div>
    </DashboardWidget>,
  ]
}

const meta = {
  title: "Components/DashboardGrid",
  component: DashboardGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Controlled dashboard layout: widgets on a CSS grid driven by a LayoutItem[] prop. Edit mode adds drag, resize, keyboard move, and undo; view mode renders zero interaction affordances.",
      },
    },
  },
  args: {
    layout: baseLayout,
  },
  argTypes: {
    layout: { table: { disable: true } },
  },
} satisfies Meta<typeof DashboardGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <DashboardGrid layout={baseLayout} rowHeight={72}>
      {widgets()}
    </DashboardGrid>
  ),
}

export const StaticWidget: Story = {
  render: () => (
    <DashboardGrid
      layout={baseLayout.map((item) =>
        item.id === "submissions" ? { ...item, static: true } : item
      )}
      rowHeight={72}
    >
      {widgets()}
    </DashboardGrid>
  ),
}

export const Collapsed: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <DashboardGrid layout={baseLayout} rowHeight={72}>
        {widgets()}
      </DashboardGrid>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvasElement.querySelector('[data-slot="dashboard-grid"]')!
    await waitFor(() => expect(grid).toHaveAttribute("data-collapsed"))
    const titles = canvas
      .getAllByText(/facilities|on-time|submissions/i)
      .map((node) => node.textContent)
    await expect(titles).toEqual([
      "Facilities",
      "On-time reports",
      "Weekly submissions",
      "Facilities by district",
    ])
  },
}

function EditableDashboard(props: {
  onLayout?: (layout: Array<LayoutItem>) => void
  withToolbar?: boolean
}) {
  const [layout, setLayout] = React.useState(baseLayout)
  return (
    <div className="flex flex-col gap-4">
      <DashboardGrid
        layout={layout}
        onLayoutChange={(next) => {
          setLayout(next)
          props.onLayout?.(next)
        }}
        mode="edit"
        rowHeight={72}
      >
        {widgets(props.withToolbar)}
      </DashboardGrid>
      <pre data-testid="layout-readout" className="text-xs text-muted-foreground">
        {JSON.stringify(layout.map(({ id, x, y, w, h }) => [id, x, y, w, h]))}
      </pre>
    </div>
  )
}

export const EditMode: Story = {
  render: () => <EditableDashboard />,
}

export const PointerDrag: Story = {
  render: () => <EditableDashboard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = await canvas.findByRole("button", { name: /^move facilities$/i })
    const grid = canvasElement.querySelector('[data-slot="dashboard-grid"]')!
    const step = grid.getBoundingClientRect().width / 12
    const from = handle.getBoundingClientRect()
    await userEvent.pointer([
      { keys: "[MouseLeft>]", target: handle, coords: { x: from.x, y: from.y } },
      { coords: { x: from.x + step * 3, y: from.y } },
      { keys: "[/MouseLeft]" },
    ])
    await waitFor(() => {
      const readout = canvas.getByTestId("layout-readout").textContent
      expect(readout).toContain('["facilities",3,0,3,2]')
      expect(readout).toContain('["on-time",3,2,3,2]')
    })
  },
}

export const DragCancel: Story = {
  render: () => <EditableDashboard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = await canvas.findByRole("button", { name: /^move facilities$/i })
    const grid = canvasElement.querySelector('[data-slot="dashboard-grid"]')!
    const step = grid.getBoundingClientRect().width / 12
    const from = handle.getBoundingClientRect()
    await userEvent.pointer([
      { keys: "[MouseLeft>]", target: handle, coords: { x: from.x, y: from.y } },
      { coords: { x: from.x + step * 3, y: from.y } },
    ])
    await userEvent.keyboard("{Escape}")
    await userEvent.pointer([{ keys: "[/MouseLeft]" }])
    await waitFor(() => {
      expect(canvas.getByTestId("layout-readout").textContent).toContain(
        '["facilities",0,0,3,2]'
      )
    })
  },
}

export const PointerResize: Story = {
  render: () => <EditableDashboard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByRole("button", { name: /^move facilities$/i })
    const grid = canvasElement.querySelector('[data-slot="dashboard-grid"]')!
    const step = grid.getBoundingClientRect().width / 12
    const facilities = canvasElement.querySelector('section[aria-label="Facilities"]')!
    const handle = facilities.querySelector(
      '[data-slot="dashboard-widget-resize"][data-axis="both"]'
    ) as HTMLElement
    const from = handle.getBoundingClientRect()
    await userEvent.pointer([
      { keys: "[MouseLeft>]", target: handle, coords: { x: from.x, y: from.y } },
      { coords: { x: from.x + step, y: from.y } },
      { keys: "[/MouseLeft]" },
    ])
    await waitFor(() => {
      const readout = canvas.getByTestId("layout-readout").textContent
      expect(readout).toContain('["facilities",0,0,4,2]')
      expect(readout).toContain('["on-time",3,2,3,2]')
    })
  },
}

export const KeyboardMove: Story = {
  render: () => <EditableDashboard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = await canvas.findByRole("button", { name: /^move facilities$/i })
    handle.focus()
    await userEvent.keyboard("{Enter}{ArrowRight}{ArrowRight}{ArrowRight}{Enter}")
    await waitFor(() => {
      const readout = canvas.getByTestId("layout-readout").textContent
      expect(readout).toContain('["facilities",3,0,3,2]')
      expect(readout).toContain('["on-time",3,2,3,2]')
    })
  },
}

export const KeyboardMoveDown: Story = {
  render: () => <EditableDashboard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = await canvas.findByRole("button", { name: /^move facilities$/i })
    handle.focus()
    await userEvent.keyboard("{Enter}{ArrowDown}{ArrowDown}")
    // Mid-gesture: the DOM must not have reordered under the focused handle.
    await expect(document.activeElement).toBe(handle)
    await userEvent.keyboard("{Enter}")
    await waitFor(() => {
      expect(document.activeElement).toBe(handle)
    })
    await waitFor(() => {
      const readout = canvas.getByTestId("layout-readout").textContent
      expect(readout).toContain('["facilities",0,0,3,2]')
      expect(readout).toContain('["on-time",3,0,3,2]')
      expect(readout).toContain('["submissions",6,0,6,4]')
      expect(readout).toContain('["districts",0,2,6,2]')
    })
  },
}

export const KeyboardResizeAndCancel: Story = {
  render: () => <EditableDashboard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = await canvas.findByRole("button", { name: /^move facilities$/i })
    handle.focus()
    await userEvent.keyboard("{Enter}{Shift>}{ArrowRight}{/Shift}{Enter}")
    await waitFor(() => {
      expect(canvas.getByTestId("layout-readout").textContent).toContain(
        '["facilities",0,0,4,2]'
      )
    })
    handle.focus()
    await userEvent.keyboard("{Enter}{Shift>}{ArrowRight}{/Shift}{Escape}")
    await waitFor(() => {
      expect(canvas.getByTestId("layout-readout").textContent).toContain(
        '["facilities",0,0,4,2]'
      )
    })
  },
}

function UndoableDashboard() {
  const gridRef = React.useRef<DashboardGridHandle>(null)
  const [layout, setLayout] = React.useState(baseLayout)
  const [history, setHistory] = React.useState({ canUndo: false, canRedo: false })
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={!history.canUndo}
          onClick={() => gridRef.current?.undo()}
        >
          Undo
        </Button>
        <Button
          variant="outline"
          disabled={!history.canRedo}
          onClick={() => gridRef.current?.redo()}
        >
          Redo
        </Button>
      </div>
      <DashboardGrid
        ref={gridRef}
        layout={layout}
        onLayoutChange={setLayout}
        onHistoryChange={setHistory}
        mode="edit"
        rowHeight={72}
      >
        {widgets()}
      </DashboardGrid>
      <pre data-testid="layout-readout" className="text-xs text-muted-foreground">
        {JSON.stringify(layout.map(({ id, x, y, w, h }) => [id, x, y, w, h]))}
      </pre>
    </div>
  )
}

export const UndoRedo: Story = {
  render: () => <UndoableDashboard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = await canvas.findByRole("button", { name: /^move facilities$/i })
    handle.focus()
    await userEvent.keyboard("{Enter}{Shift>}{ArrowRight}{/Shift}{Enter}")
    await waitFor(() => {
      expect(canvas.getByTestId("layout-readout").textContent).toContain(
        '["facilities",0,0,4,2]'
      )
    })
    await userEvent.click(canvas.getByRole("button", { name: "Undo" }))
    await waitFor(() => {
      expect(canvas.getByTestId("layout-readout").textContent).toContain(
        '["facilities",0,0,3,2]'
      )
    })
    await userEvent.click(canvas.getByRole("button", { name: "Redo" }))
    await waitFor(() => {
      expect(canvas.getByTestId("layout-readout").textContent).toContain(
        '["facilities",0,0,4,2]'
      )
    })
    handle.focus()
    await userEvent.keyboard("{Control>}z{/Control}")
    await waitFor(() => {
      expect(canvas.getByTestId("layout-readout").textContent).toContain(
        '["facilities",0,0,3,2]'
      )
    })
  },
}

export const RemoveWidget: Story = {
  render: () => <EditableDashboard withToolbar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByRole("button", { name: /^move facilities$/i })
    await userEvent.click(canvas.getByRole("button", { name: "Remove Facilities" }))
    await waitFor(() => {
      const readout = canvas.getByTestId("layout-readout").textContent
      expect(readout).not.toContain('"facilities"')
      expect(readout).toContain('["on-time",3,0,3,2]')
    })
    await expect(
      canvas.queryByRole("region", { name: "Facilities" })
    ).not.toBeInTheDocument()
  },
}
