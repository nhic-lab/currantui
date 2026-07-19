import { expect, userEvent, within } from "storybook/test"

import {
  Inspector,
  InspectorRow,
  InspectorSection,
  InspectorSeparator,
} from "@nhic/currantui/components/inspector"
import { Input } from "@nhic/currantui/components/input"
import { NumberField } from "@nhic/currantui/components/number-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nhic/currantui/components/select"
import { Switch } from "@nhic/currantui/components/switch"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Inspector",
  component: Inspector,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Property-pane chrome for authoring surfaces: a labeled aside with collapsible sections. Apps fill InspectorRow with the existing Field/Select/Switch/Input controls; the label is presentational, so associate a real label with the control inside (aria-label, or a Field's own label) for accessibility.",
      },
    },
  },
} satisfies Meta<typeof Inspector>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Inspector aria-label="Widget properties" header="Facilities">
      <InspectorSection title="Layout" defaultOpen>
        <InspectorRow label="Title">
          <Input aria-label="Widget title" defaultValue="Facilities" />
        </InspectorRow>
        <InspectorRow label="Height">
          <NumberField aria-label="Widget height" defaultValue={2} minValue={1} />
        </InspectorRow>
      </InspectorSection>
      <InspectorSeparator />
      <InspectorSection title="Display">
        <InspectorRow label="Aggregate">
          <Select defaultValue="sum">
            <SelectTrigger aria-label="Aggregate" size="sm" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sum">Sum</SelectItem>
              <SelectItem value="mean">Mean</SelectItem>
              <SelectItem value="count">Count</SelectItem>
            </SelectContent>
          </Select>
        </InspectorRow>
        <InspectorRow label="Show totals">
          <Switch aria-label="Show totals" defaultChecked />
        </InspectorRow>
      </InspectorSection>
    </Inspector>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: "Display" })
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(canvas.queryByLabelText("Show totals")).not.toBeInTheDocument()

    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(canvas.getByLabelText("Show totals")).toBeInTheDocument()

    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  },
}
