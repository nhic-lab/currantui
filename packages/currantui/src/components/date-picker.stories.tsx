import { I18nProvider } from "react-aria-components"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { DatePicker } from "@nhic/currantui/components/date-picker"
import { CalendarDate } from "@nhic/currantui/lib/date"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/DatePicker",
  component: DatePicker,
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
  args: {
    label: "Report date",
    // Pinned so the rendered month is stable across machines and timezones
    defaultValue: new CalendarDate(2026, 3, 14),
  },
  render: (args) => (
    <div className="w-56">
      <DatePicker {...args} />
    </div>
  ),
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button"))
    // The calendar renders in a portal outside the canvas root
    const body = within(document.body)
    await userEvent.click(
      await body.findByRole("button", { name: /march 20/i })
    )
    await waitFor(() =>
      expect(
        canvas.getByRole("spinbutton", { name: /day/i })
      ).toHaveTextContent("20")
    )
  },
}

export const Placeholder: Story = {
  args: { defaultValue: undefined, description: "Format: month / day / year" },
}

export const MinMax: Story = {
  args: {
    minValue: new CalendarDate(2026, 3, 9),
    maxValue: new CalendarDate(2026, 3, 20),
  },
}

export const Invalid: Story = {
  args: { isInvalid: true },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}
