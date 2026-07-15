import { expect, userEvent, within } from "storybook/test"

import { ContextualHelp } from "@nhic/currantui/components/contextual-help"
import { Input } from "@nhic/currantui/components/input"
import { Label } from "@nhic/currantui/components/label"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/ContextualHelp",
  component: ContextualHelp,
  parameters: {
    docs: {
      description: {
        component:
          "Toggletip preset for explaining a nearby field or heading — an info or question icon that opens a titled help bubble. Place it right after the label it explains.",
      },
    },
  },
  args: {
    title: "Catchment population",
    children:
      "Residents the facility is responsible for, from the latest census projection. Used as the denominator for coverage indicators.",
  },
  argTypes: {
    icon: { control: "select", options: ["info", "question"] },
  },
} satisfies Meta<typeof ContextualHelp>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-48 items-start justify-center pt-24">
      <ContextualHelp {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole("button", { name: "More information" })
    )
    const dialog = await within(document.body).findByRole("dialog", {
      name: "More information",
    })
    await expect(dialog).toHaveTextContent("Catchment population")
  },
}

export const QuestionIcon: Story = {
  args: {
    icon: "question",
    title: "Why is this locked?",
    children:
      "Closed periods can no longer be edited. Ask a district manager to reopen the period if a correction is needed.",
  },
  render: (args) => (
    <div className="flex min-h-48 items-start justify-center pt-24">
      <ContextualHelp {...args} />
    </div>
  ),
}

export const NextToAField: Story = {
  render: (args) => (
    <div className="flex min-h-56 w-72 flex-col gap-1 pt-24">
      <div className="flex items-center gap-1">
        <Label htmlFor="catchment">Catchment population</Label>
        <ContextualHelp {...args} />
      </div>
      <Input id="catchment" inputMode="numeric" placeholder="530,000" />
    </div>
  ),
}
