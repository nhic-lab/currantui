import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  DashboardGrid,
  DashboardWidget,
} from "@nhic/currantui/components/dashboard-grid"
import { WidgetPalette } from "@nhic/currantui/components/dashboard-widget-chrome"
import { findSlot } from "@nhic/currantui/lib/grid-layout"
import type { LayoutItem } from "@nhic/currantui/lib/grid-layout"

import type { Meta, StoryObj } from "@storybook/react-vite"

const paletteItems = [
  { type: "kpi", label: "KPI card", description: "Single headline number" },
  { type: "chart", label: "Chart", description: "Time series or categorical" },
  { type: "table", label: "Table", description: "Row-level detail" },
]

const meta = {
  title: "Components/WidgetPalette",
  component: WidgetPalette,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Click-to-add list of app-supplied widget types for dashboard authoring. The app owns widget creation; pair with findSlot() for placement.",
      },
    },
  },
} satisfies Meta<typeof WidgetPalette>

export default meta
type Story = StoryObj<typeof meta>

/*
 * Stateful story rendered through a wrapper component, which Storybook's
 * "Show code" cannot expand — carries an explicit, copyable docs.source
 * snippet instead.
 */
const defaultSource = `
function DefaultPalette() {
  const [added, setAdded] = React.useState<Array<string>>([])
  return (
    <div className="flex flex-col gap-3">
      <WidgetPalette
        aria-label="Add a widget"
        items={paletteItems}
        onWidgetAdd={(type) => setAdded((current) => [...current, type])}
      />
      <ul className="text-sm text-muted-foreground">
        {added.map((type, index) => (
          <li key={index}>{type}</li>
        ))}
      </ul>
    </div>
  )
}
`.trim()

function DefaultPalette() {
  const [added, setAdded] = React.useState<Array<string>>([])
  return (
    <div className="flex flex-col gap-3">
      <WidgetPalette
        aria-label="Add a widget"
        items={paletteItems}
        onWidgetAdd={(type) => setAdded((current) => [...current, type])}
      />
      <ul data-testid="added-readout" className="text-sm text-muted-foreground">
        {added.map((type, index) => (
          <li key={index}>{type}</li>
        ))}
      </ul>
    </div>
  )
}

export const Default: Story = {
  args: {
    items: paletteItems,
    onWidgetAdd: () => {},
  },
  render: () => <DefaultPalette />,
  parameters: {
    docs: { source: { code: defaultSource, language: "tsx" } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const kpiRow = canvas.getByRole("row", { name: /kpi card/i })
    await userEvent.click(kpiRow)
    await waitFor(() => {
      expect(canvas.getByTestId("added-readout").textContent).toContain("kpi")
    })
  },
}

function AuthoringExample() {
  const [layout, setLayout] = React.useState<Array<LayoutItem>>([
    { id: "facilities", x: 0, y: 0, w: 4, h: 2 },
  ])
  const [added, setAdded] = React.useState<Array<string>>([])
  const addWidget = (type: string) => {
    const id = `${type}-${added.length + 1}`
    const slot = findSlot(layout, 4, 2, 12)
    setLayout((current) => [...current, { id, ...slot, w: 4, h: 2 }])
    setAdded((current) => [...current, id])
  }
  return (
    <div className="flex items-start gap-4">
      <WidgetPalette
        aria-label="Add a widget"
        items={paletteItems}
        onWidgetAdd={addWidget}
      />
      <DashboardGrid
        layout={layout}
        onLayoutChange={setLayout}
        mode="edit"
        rowHeight={72}
        className="flex-1"
      >
        <DashboardWidget id="facilities" title="Facilities">
          <span className="text-sm text-muted-foreground">Existing widget</span>
        </DashboardWidget>
        {added.map((id) => (
          <DashboardWidget key={id} id={id} title={`New ${id}`}>
            <span className="text-sm text-muted-foreground">Added via palette</span>
          </DashboardWidget>
        ))}
      </DashboardGrid>
    </div>
  )
}

/* Stateful wrapper story — "Show code" gets an explicit copyable snippet */
const authoringSource = `
function AuthoringDashboard() {
  const [layout, setLayout] = React.useState<Array<LayoutItem>>(initialLayout)
  const addWidget = (type: string) => {
    const id = createWidgetId(type)
    const slot = findSlot(layout, 4, 2, 12)
    setLayout((current) => [...current, { id, ...slot, w: 4, h: 2 }])
  }
  return (
    <div className="flex items-start gap-4">
      <WidgetPalette
        aria-label="Add a widget"
        items={[
          { type: "kpi", label: "KPI card", description: "Single headline number" },
          { type: "chart", label: "Chart", description: "Time series or categorical" },
        ]}
        onWidgetAdd={addWidget}
      />
      <DashboardGrid layout={layout} onLayoutChange={setLayout} mode="edit" className="flex-1">
        {myWidgets}
      </DashboardGrid>
    </div>
  )
}
`.trim()

export const Authoring: Story = {
  args: {
    items: paletteItems,
    onWidgetAdd: () => {},
  },
  render: () => <AuthoringExample />,
  parameters: { docs: { source: { code: authoringSource, language: "tsx" } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const kpiRow = canvas.getByRole("row", { name: /kpi card/i })
    await expect(kpiRow).toHaveAttribute("draggable", "true")
    await userEvent.click(kpiRow)
    await waitFor(() => {
      expect(canvas.getByText("New kpi-1")).toBeInTheDocument()
    })
  },
}

function AuthoringDropExample() {
  const [layout, setLayout] = React.useState<Array<LayoutItem>>([
    { id: "facilities", x: 0, y: 0, w: 4, h: 2 },
  ])
  const [dropped, setDropped] = React.useState<Array<string>>([])
  const insertWidget = (type: string, cell?: { x: number; y: number }) => {
    const id = `${type}-${dropped.length + 1}`
    const occupied =
      cell !== undefined &&
      layout.some(
        (item) =>
          cell.x < item.x + item.w &&
          cell.x + 4 > item.x &&
          cell.y < item.y + item.h &&
          cell.y + 2 > item.y
      )
    const slot = cell === undefined || occupied ? findSlot(layout, 4, 2, 12) : cell
    setLayout((current) => [...current, { id, ...slot, w: 4, h: 2 }])
    setDropped((current) => [...current, id])
  }
  return (
    <div className="flex items-start gap-4">
      <WidgetPalette
        aria-label="Add a widget"
        items={paletteItems}
        onWidgetAdd={(type) => insertWidget(type)}
      />
      <DashboardGrid
        layout={layout}
        onLayoutChange={setLayout}
        onWidgetDrop={(type, cell) => insertWidget(type, cell)}
        mode="edit"
        rowHeight={72}
        className="flex-1"
      >
        <DashboardWidget id="facilities" title="Facilities">
          <span className="text-sm text-muted-foreground">Existing widget</span>
        </DashboardWidget>
        {dropped.map((id) => (
          <DashboardWidget key={id} id={id} title={`Dropped ${id}`}>
            <span className="text-sm text-muted-foreground">Dropped from palette</span>
          </DashboardWidget>
        ))}
      </DashboardGrid>
      <pre data-testid="drop-readout" className="text-xs text-muted-foreground">
        {JSON.stringify(dropped)}
      </pre>
    </div>
  )
}

/* Stateful wrapper story — "Show code" gets an explicit copyable snippet */
const authoringDropSource = `
function AuthoringDropDashboard() {
  const [layout, setLayout] = React.useState<Array<LayoutItem>>(initialLayout)
  const insertWidget = (type: string, cell?: { x: number; y: number }) => {
    const id = createWidgetId(type)
    const occupied =
      cell !== undefined &&
      layout.some(
        (item) =>
          cell.x < item.x + item.w &&
          cell.x + 4 > item.x &&
          cell.y < item.y + item.h &&
          cell.y + 2 > item.y
      )
    const slot = cell === undefined || occupied ? findSlot(layout, 4, 2, 12) : cell
    setLayout((current) => [...current, { id, ...slot, w: 4, h: 2 }])
  }
  return (
    <div className="flex items-start gap-4">
      <WidgetPalette
        aria-label="Add a widget"
        items={[
          { type: "kpi", label: "KPI card", description: "Single headline number" },
          { type: "chart", label: "Chart", description: "Time series or categorical" },
        ]}
        onWidgetAdd={(type) => insertWidget(type)}
      />
      <DashboardGrid
        layout={layout}
        onLayoutChange={setLayout}
        onWidgetDrop={(type, cell) => insertWidget(type, cell)}
        mode="edit"
        className="flex-1"
      >
        {myWidgets}
      </DashboardGrid>
    </div>
  )
}
`.trim()

export const AuthoringDrop: Story = {
  args: {
    items: paletteItems,
    onWidgetAdd: () => {},
  },
  render: () => <AuthoringDropExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Dragging a palette row over the grid activates a drop overlay; dropping (or clicking a palette row) calls the same placement logic — onWidgetDrop(type, cell) with the app deciding placement via findSlot, falling back to that same slot search for click-to-add.",
      },
      source: { code: authoringDropSource, language: "tsx" },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    /*
     * Keyboard drag: focus the palette row's drag handle, Enter to start.
     * The grid's drop-zone overlay mounts only for this drag and is the
     * sole registered drop target, so react-aria auto-focuses it
     * immediately (same auto-focus behavior verified in
     * field-well.stories.tsx); a second Enter drops.
     */
    const dragHandle = canvas.getByRole("button", { name: "Drag Chart" })
    dragHandle.focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{Enter}")
    await waitFor(() => {
      expect(canvas.getByTestId("drop-readout").textContent).toContain("chart-1")
    })
    await expect(canvas.getByText("Dropped chart-1")).toBeInTheDocument()
  },
}
