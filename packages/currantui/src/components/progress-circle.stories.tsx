import { ProgressCircle } from "@nhic/currantui/components/progress-circle"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/ProgressCircle",
  component: ProgressCircle,
  parameters: {
    docs: {
      description: {
        component:
          "Circular progress — a determinate ring for known completion, or an indeterminate spinner when `value` is nullish. Use Progress for linear bars; the deprecated Loader now delegates here.",
      },
    },
  },
  args: {
    "aria-label": "Upload progress",
    value: 60,
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "select", options: ["sm", "default", "lg"] },
  },
} satisfies Meta<typeof ProgressCircle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Indeterminate: Story = {
  args: { "aria-label": "Loading", value: null },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <ProgressCircle {...args} size="sm" />
      <ProgressCircle {...args} size="default" />
      <ProgressCircle {...args} size="lg" />
    </div>
  ),
}

export const Values: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <ProgressCircle {...args} value={15} />
      <ProgressCircle {...args} value={45} />
      <ProgressCircle {...args} value={80} />
      <ProgressCircle {...args} value={100} />
    </div>
  ),
}
