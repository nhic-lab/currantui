import { useState } from "react"
import { expect, userEvent, within } from "storybook/test"

import { SearchField } from "@nhic/currantui/components/search-field"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/SearchField",
  component: SearchField,
  args: {
    value: "",
    onValueChange: () => {},
    placeholder: "Patient, ID, accession…",
  },
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Typing: Story = {
  render: function TypingStory(args) {
    const [value, setValue] = useState("")
    return <SearchField {...args} value={value} onValueChange={setValue} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("searchbox", { name: "Search" })
    await userEvent.type(input, "Mukamana")
    await expect(input).toHaveValue("Mukamana")
  },
}
