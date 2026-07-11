import { useState } from "react"

import { FilterChip } from "@nhic/currantui/components/filter-chip"
import { SearchField } from "@nhic/currantui/components/search-field"
import {
  TableToolbar,
  TableToolbarLabel,
  TableToolbarSeparator,
} from "@nhic/currantui/components/table-toolbar"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/TableToolbar",
  component: TableToolbar,
  parameters: { layout: "padded" },
  args: {
    children: null,
  },
} satisfies Meta<typeof TableToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Composed: Story = {
  render: function ComposedStory() {
    const [modalities, setModalities] = useState<Array<string>>(["CT"])
    const [year, setYear] = useState<string | undefined>(undefined)
    const [q, setQ] = useState("")
    const toggle = (value: string) =>
      setModalities((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
      )
    return (
      <TableToolbar>
        <div className="flex flex-wrap items-center gap-1">
          {["CT", "MR", "US"].map((m) => (
            <FilterChip key={m} active={modalities.includes(m)} onClick={() => toggle(m)}>
              {m}
            </FilterChip>
          ))}
        </div>
        <TableToolbarSeparator />
        <div className="flex items-center gap-1.5">
          <TableToolbarLabel>Year</TableToolbarLabel>
          <div className="flex items-center gap-1">
            <FilterChip active={!year} onClick={() => setYear(undefined)}>
              All
            </FilterChip>
            {["2026", "2025"].map((y) => (
              <FilterChip key={y} active={year === y} onClick={() => setYear(y)}>
                {y}
              </FilterChip>
            ))}
          </div>
        </div>
        <SearchField
          className="ml-auto"
          value={q}
          onValueChange={setQ}
          placeholder="Patient, ID, accession…"
        />
      </TableToolbar>
    )
  },
}
