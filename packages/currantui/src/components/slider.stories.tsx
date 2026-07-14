import { Slider } from "@nhic/currantui/components/slider"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/Slider",
  component: Slider,
  render: (args) => <Slider className="w-72" {...args} />,
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    "aria-label": "Completeness threshold",
    defaultValue: [60],
  },
}

export const Range: Story = {
  args: {
    thumbLabels: ["Minimum age", "Maximum age"],
    defaultValue: [18, 45],
    minStepsBetweenThumbs: 1,
  },
}

export const Steps: Story = {
  args: {
    "aria-label": "Review sample size",
    defaultValue: [20],
    step: 10,
    max: 50,
  },
}

export const Disabled: Story = {
  args: {
    "aria-label": "Completeness threshold",
    defaultValue: [60],
    disabled: true,
  },
}
