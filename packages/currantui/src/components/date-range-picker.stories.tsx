import { I18nProvider } from "react-aria-components"
import { userEvent, within } from "storybook/test"

import { DateRangePicker } from "@nhic/currantui/components/date-range-picker"
import { CalendarDate } from "@nhic/currantui/lib/date"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/DateRangePicker",
  component: DateRangePicker,
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
  args: {
    label: "Reporting period",
    // Pinned so the rendered month is stable across machines and timezones
    defaultValue: {
      start: new CalendarDate(2026, 3, 9),
      end: new CalendarDate(2026, 3, 20),
    },
  },
  render: (args) => (
    <div className="w-80">
      <DateRangePicker {...args} />
    </div>
  ),
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button"))
    // The range calendar renders in a portal outside the canvas root
    await within(document.body).findByRole("heading", { name: /march 2026/i })
  },
}

export const Placeholder: Story = {
  args: { defaultValue: undefined },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}
