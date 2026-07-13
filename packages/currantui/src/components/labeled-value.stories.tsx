import { LabeledValue } from "@nhic/currantui/components/labeled-value"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/LabeledValue",
  component: LabeledValue,
  args: {
    label: "Reporting period",
    children: "Week 28, 2026",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
  },
} satisfies Meta<typeof LabeledValue>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
}

export const Group: Story = {
  render: () => (
    <div className="grid w-96 grid-cols-3 gap-4">
      <LabeledValue label="Facilities">478</LabeledValue>
      <LabeledValue label="On time">412</LabeledValue>
      <LabeledValue label="Completeness">98.2%</LabeledValue>
    </div>
  ),
}
