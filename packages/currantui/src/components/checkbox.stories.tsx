import { Checkbox } from "@nhic/currantui/components/checkbox"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/Checkbox",
  component: Checkbox,
  args: {
    "aria-label": "Accept terms",
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { "aria-invalid": true },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="consent" />
      <label htmlFor="consent" className="text-xs/relaxed">
        Patient has given consent
      </label>
    </div>
  ),
}
