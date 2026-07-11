import { useState } from "react"
import { expect, userEvent, within } from "storybook/test"

import { FilterChip } from "@nhic/currantui/components/filter-chip"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/FilterChip",
  component: FilterChip,
  args: {
    active: false,
    onClick: () => {},
    children: "CT",
  },
} satisfies Meta<typeof FilterChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Active: Story = {
  args: { active: true },
}

export const ChipGroup: Story = {
  render: function ChipGroupStory() {
    const [selected, setSelected] = useState<Array<string>>(["MR"])
    const toggle = (value: string) =>
      setSelected((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
      )
    return (
      <div className="flex flex-wrap items-center gap-1">
        {["CT", "MR", "US", "CR", "PT", "DX"].map((value) => (
          <FilterChip
            key={value}
            active={selected.includes(value)}
            onClick={() => toggle(value)}
          >
            {value}
          </FilterChip>
        ))}
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const ct = canvas.getByRole("button", { name: "CT" })
    await expect(ct).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(ct)
    await expect(ct).toHaveAttribute("aria-pressed", "true")
  },
}
