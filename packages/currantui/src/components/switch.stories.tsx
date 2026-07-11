import { Switch } from "@nhic/currantui/components/switch"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Switch",
  component: Switch,
  args: {
    "aria-label": "Enable notifications",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} size="sm" aria-label="Small switch" />
      <Switch {...args} size="default" aria-label="Default switch" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="anonymize" />
      <label htmlFor="anonymize" className="text-xs/relaxed">
        Anonymize exported data
      </label>
    </div>
  ),
}
