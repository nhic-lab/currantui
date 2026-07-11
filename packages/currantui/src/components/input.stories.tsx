import { Input } from "@nhic/currantui/components/input"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    placeholder: "Patient identifier",
    "aria-label": "Patient identifier",
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "not-a-valid-id" },
}

export const File: Story = {
  args: { type: "file", "aria-label": "Upload report" },
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-64 gap-1">
      <label htmlFor="facility" className="text-xs/relaxed font-medium">
        Facility name
      </label>
      <Input {...args} id="facility" aria-label={undefined} />
    </div>
  ),
}
