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

export const Default: Story = {
  args: {
    items: paletteItems,
    onWidgetAdd: () => {},
  },
  render: () => (
    <WidgetPalette
      aria-label="Add a widget"
      items={paletteItems}
      onWidgetAdd={() => {}}
    />
  ),
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

export const Authoring: Story = {
  args: {
    items: paletteItems,
    onWidgetAdd: () => {},
  },
  render: () => <AuthoringExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: /kpi card/i }))
    await waitFor(() => {
      expect(canvas.getByText("New kpi-1")).toBeInTheDocument()
    })
  },
}
