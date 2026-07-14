import { Meter } from "@nhic/currantui/components/meter"
import { LabeledValue } from "@nhic/currantui/components/labeled-value"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Meter",
  component: Meter,
  parameters: {
    docs: {
      description: {
        component:
          "Static measurement within a known range (storage, capacity, scores). Use Progress for the advancement of a running task.",
      },
    },
  },
  args: {
    "aria-label": "Storage used",
    value: 64,
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "info", "destructive"],
    },
  },
  render: (args) => <Meter className="w-72" {...args} />,
} satisfies Meta<typeof Meter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Thresholds: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Meter aria-label="Storage used (healthy)" value={42} variant="success" />
      <Meter aria-label="Storage used (rising)" value={71} variant="warning" />
      <Meter
        aria-label="Storage used (critical)"
        value={93}
        variant="destructive"
      />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-1.5">
      <LabeledValue label="Cold-chain capacity" orientation="horizontal">
        7.4 of 10 m³
      </LabeledValue>
      <Meter aria-label="Cold-chain capacity" value={74} />
    </div>
  ),
}
