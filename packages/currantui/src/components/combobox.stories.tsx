import { expect, userEvent, waitFor, within } from "storybook/test"

import { Combobox } from "@nhic/currantui/components/combobox"

import type { Meta, StoryObj } from "@storybook/react-vite"

const facilities = [
  { value: "hf-0042", label: "Kigali Central" },
  { value: "hf-0107", label: "Gasabo District Hospital" },
  { value: "hf-0233", label: "Musanze Health Center" },
  { value: "hf-0301", label: "Huye Referral Hospital" },
  { value: "hf-0388", label: "Rubavu Health Post", disabled: true },
]

const meta = {
  title: "Components/Forms/Combobox",
  component: Combobox,
  args: {
    options: facilities,
    placeholder: "Select facility",
    searchPlaceholder: "Search facilities…",
    "aria-label": "Facility",
  },
  render: (args) => (
    <div className="w-64">
      <Combobox {...args} />
    </div>
  ),
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("combobox", { name: "Facility" })

    await userEvent.click(trigger)
    // Options render in a portal outside the canvas root
    const body = within(document.body)
    await userEvent.type(
      await body.findByRole("combobox", { name: "Search facilities…" }),
      "musanze"
    )
    await userEvent.click(
      await body.findByText("Musanze Health Center")
    )
    await waitFor(() =>
      expect(trigger).toHaveTextContent("Musanze Health Center")
    )
  },
}

export const Preselected: Story = {
  args: { defaultValue: "hf-0107" },
}

export const Invalid: Story = {
  args: { "aria-invalid": true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
