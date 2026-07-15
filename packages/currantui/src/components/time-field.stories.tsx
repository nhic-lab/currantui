import { I18nProvider } from "react-aria-components"

import { Time } from "@nhic/currantui/lib/date"
import { TimeField } from "@nhic/currantui/components/time-field"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/TimeField",
  component: TimeField,
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
  args: {
    label: "Submission cut-off",
    defaultValue: new Time(18, 0),
  },
  render: (args) => (
    <div className="w-40">
      <TimeField {...args} />
    </div>
  ),
} satisfies Meta<typeof TimeField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TwentyFourHour: Story = {
  args: { hourCycle: 24 },
}

export const WithSeconds: Story = {
  args: { granularity: "second", defaultValue: new Time(18, 0, 30) },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}
