import { Progress } from "@nhic/currantui/components/progress"
import { Label } from "@nhic/currantui/components/label"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Progress",
  component: Progress,
  args: {
    "aria-label": "Upload progress",
    value: 60,
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
  },
  render: (args) => <Progress className="w-72" {...args} />,
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Values: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-3">
      <Progress {...args} value={12} />
      <Progress {...args} value={45} />
      <Progress {...args} value={80} />
      <Progress {...args} value={100} />
    </div>
  ),
}

export const Indeterminate: Story = {
  args: { value: null },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <Label htmlFor="upload-progress">Uploading week 28 report</Label>
        <span className="text-[0.625rem] text-muted-foreground tabular-nums">
          60%
        </span>
      </div>
      <Progress id="upload-progress" aria-label="Uploading week 28 report" value={60} />
    </div>
  ),
}
