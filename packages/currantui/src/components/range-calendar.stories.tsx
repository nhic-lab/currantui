import { I18nProvider } from "react-aria-components"

import { CalendarDate } from "@nhic/currantui/lib/date"
import { RangeCalendar } from "@nhic/currantui/components/range-calendar"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/RangeCalendar",
  component: RangeCalendar,
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
  args: {
    "aria-label": "Reporting period",
    // Pinned so the rendered month is stable across machines and timezones
    defaultValue: {
      start: new CalendarDate(2026, 3, 9),
      end: new CalendarDate(2026, 3, 20),
    },
  },
} satisfies Meta<typeof RangeCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MinMax: Story = {
  args: {
    minValue: new CalendarDate(2026, 3, 2),
    maxValue: new CalendarDate(2026, 3, 27),
  },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}
