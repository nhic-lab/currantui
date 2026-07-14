import { ChartBarIcon, MapTrifoldIcon, TableIcon } from "@phosphor-icons/react"
import { expect, userEvent, within } from "storybook/test"

import {
  SegmentedControl,
  SegmentedControlItem,
} from "@nhic/currantui/components/segmented-control"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    docs: {
      description: {
        component:
          "Single-select control for switching views of the same data — one option is always active. Use Tabs when the options switch visible panels.",
      },
    },
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <SegmentedControl defaultValue="table" aria-label="View">
      <SegmentedControlItem value="table">Table</SegmentedControlItem>
      <SegmentedControlItem value="chart">Chart</SegmentedControlItem>
      <SegmentedControlItem value="map">Map</SegmentedControlItem>
    </SegmentedControl>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole("radio", { name: "Table" })
    const chart = canvas.getByRole("radio", { name: "Chart" })

    await userEvent.click(chart)
    await expect(chart).toHaveAttribute("data-state", "on")

    // Re-clicking the active option never deselects it
    await userEvent.click(chart)
    await expect(chart).toHaveAttribute("data-state", "on")
    await expect(table).toHaveAttribute("data-state", "off")
  },
}

export const WithIcons: Story = {
  render: () => (
    <SegmentedControl defaultValue="table" aria-label="View">
      <SegmentedControlItem value="table">
        <TableIcon />
        Table
      </SegmentedControlItem>
      <SegmentedControlItem value="chart">
        <ChartBarIcon />
        Chart
      </SegmentedControlItem>
      <SegmentedControlItem value="map">
        <MapTrifoldIcon />
        Map
      </SegmentedControlItem>
    </SegmentedControl>
  ),
}

export const WithDisabledOption: Story = {
  render: () => (
    <SegmentedControl defaultValue="table" aria-label="View">
      <SegmentedControlItem value="table">Table</SegmentedControlItem>
      <SegmentedControlItem value="chart">Chart</SegmentedControlItem>
      <SegmentedControlItem value="map" disabled>
        Map
      </SegmentedControlItem>
    </SegmentedControl>
  ),
}
