import { I18nProvider } from "react-aria-components"

import { CalendarDate } from "@nhic/currantui/lib/date"
import { Calendar } from "@nhic/currantui/components/calendar"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  // Pin the locale so segments/weekday headers are machine-independent
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
  args: {
    "aria-label": "Report date",
    // Pinned so the rendered month is stable across machines and timezones
    defaultValue: new CalendarDate(2026, 3, 14),
  },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MinMax: Story = {
  args: {
    minValue: new CalendarDate(2026, 3, 9),
    maxValue: new CalendarDate(2026, 3, 20),
  },
}

export const Unavailable: Story = {
  args: {
    isDateUnavailable: (date) => date.day % 7 === 0,
  },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}
