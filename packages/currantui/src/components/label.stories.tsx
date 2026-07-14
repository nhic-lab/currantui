import { Label } from "@nhic/currantui/components/label"
import { Checkbox } from "@nhic/currantui/components/checkbox"
import { Input } from "@nhic/currantui/components/input"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/Label",
  component: Label,
  args: {
    children: "Facility name",
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithInput: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label {...args} htmlFor="facility-name" />
      <Input id="facility-name" placeholder="Kigali Central" />
    </div>
  ),
}

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-1.5">
      <Checkbox id="include-archived" />
      <Label htmlFor="include-archived">Include archived facilities</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="group flex w-64 flex-col gap-1.5" data-disabled="true">
      <Label {...args} htmlFor="facility-code" />
      <Input id="facility-code" disabled placeholder="HF-0042" />
    </div>
  ),
}
