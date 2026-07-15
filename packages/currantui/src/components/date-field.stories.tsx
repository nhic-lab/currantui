import { I18nProvider } from "react-aria-components"
import { expect, userEvent, within } from "storybook/test"

import { CalendarDate } from "@nhic/currantui/lib/date"
import { DateField } from "@nhic/currantui/components/date-field"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/DateField",
  component: DateField,
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
  args: {
    label: "Report date",
    defaultValue: new CalendarDate(2026, 3, 14),
  },
  render: (args) => (
    <div className="w-56">
      <DateField {...args} />
    </div>
  ),
} satisfies Meta<typeof DateField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const month = canvas.getByRole("spinbutton", { name: /month/i })

    // Segments edit with the keyboard: type replaces, arrows step
    await userEvent.click(month)
    await userEvent.keyboard("{ArrowUp}")
    await expect(month).toHaveTextContent("4")
  },
}

export const Placeholder: Story = {
  args: { defaultValue: undefined, description: "Format: month / day / year" },
}

export const Invalid: Story = {
  args: { isInvalid: true },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}
