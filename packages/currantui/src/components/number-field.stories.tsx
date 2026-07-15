import { I18nProvider } from "react-aria-components"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { NumberField } from "@nhic/currantui/components/number-field"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/NumberField",
  component: NumberField,
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
  args: {
    label: "Sample size",
    defaultValue: 25,
  },
  render: (args) => (
    <div className="w-48">
      <NumberField {...args} />
    </div>
  ),
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: /increase/i }))
    await waitFor(() =>
      expect(canvas.getByRole("textbox", { name: "Sample size" })).toHaveValue(
        "26"
      )
    )
  },
}

export const Currency: Story = {
  args: {
    label: "Budget",
    defaultValue: 1250,
    formatOptions: { style: "currency", currency: "RWF" },
  },
}

export const Percent: Story = {
  args: {
    label: "Completeness target",
    defaultValue: 0.95,
    formatOptions: { style: "percent" },
    step: 0.01,
  },
}

export const MinMaxStep: Story = {
  args: { minValue: 0, maxValue: 100, step: 5, description: "0–100, steps of 5" },
}

export const Invalid: Story = {
  args: { isInvalid: true },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}
