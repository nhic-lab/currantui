import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { FieldWellGroup } from "@nhic/currantui/components/field-well"
import { pivotConfigFromWells } from "@nhic/currantui/lib/field-well"
import { PivotTable } from "@nhic/currantui/components/pivot-table"
import type {
  FieldWellDefinition,
  FieldWellValue,
  WellField,
} from "@nhic/currantui/lib/field-well"

import type { Meta, StoryObj } from "@storybook/react-vite"

export const fields: Array<WellField> = [
  { id: "province", label: "Province", type: "dimension" },
  { id: "district", label: "District", type: "dimension" },
  { id: "quarter", label: "Quarter", type: "dimension" },
  { id: "reports", label: "Reports", type: "measure" },
  { id: "onTime", label: "On time", type: "measure", aggregate: "mean" },
]

export const wells: Array<FieldWellDefinition> = [
  { id: "rows", label: "Rows", accepts: ["dimension"] },
  { id: "columns", label: "Columns", accepts: ["dimension"], maxItems: 1 },
  { id: "values", label: "Values", accepts: ["measure"] },
]

export const reporting = [
  { province: "Kigali", district: "Gasabo", quarter: "Q1", reports: 40, onTime: 92 },
  { province: "Kigali", district: "Gasabo", quarter: "Q2", reports: 44, onTime: 95 },
  { province: "Kigali", district: "Kicukiro", quarter: "Q1", reports: 30, onTime: 88 },
  { province: "North", district: "Musanze", quarter: "Q1", reports: 26, onTime: 90 },
]

const meta = {
  title: "Components/FieldWellGroup",
  component: FieldWellGroup,
  excludeStories: ["fields", "wells", "reporting"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Drag-and-drop field wells: drag fields from a source list into typed drop wells (react-aria GridList drag-and-drop). Movement/replacement semantics come from the pure applyFieldMove engine.",
      },
    },
  },
  args: {
    fields,
    wells,
    value: { rows: [], columns: [], values: [] },
    onValueChange: () => {},
    "aria-label": "Pivot fields",
  },
  argTypes: {
    fields: { table: { disable: true } },
    wells: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
} satisfies Meta<typeof FieldWellGroup>

export default meta
type Story = StoryObj<typeof meta>

/*
 * Stateful story rendered through a wrapper component, which Storybook's
 * "Show code" cannot expand — carries an explicit, copyable docs.source
 * snippet instead.
 */
const defaultSource = `
function DefaultWells() {
  const [value, setValue] = React.useState<FieldWellValue>({
    rows: [],
    columns: [],
    values: [],
  })
  return (
    <FieldWellGroup
      aria-label="Pivot fields"
      fields={fields}
      wells={wells}
      value={value}
      onValueChange={setValue}
    />
  )
}
`.trim()

function DefaultWells() {
  const [value, setValue] = React.useState<FieldWellValue>({
    rows: [],
    columns: [],
    values: [],
  })
  return (
    <FieldWellGroup
      aria-label="Pivot fields"
      fields={fields}
      wells={wells}
      value={value}
      onValueChange={setValue}
    />
  )
}

export const Default: Story = {
  render: () => <DefaultWells />,
  parameters: {
    docs: { source: { code: defaultSource, language: "tsx" } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    /*
     * Keyboard drag: focus the source list's "Drag Province" handle, Enter
     * to start, Enter again to drop on the auto-focused nearest well (Rows,
     * matching the ConfiguredWells story below) — proves Default is
     * actually interactive, not frozen on empty controlled props.
     */
    const dragHandle = canvas.getByRole("button", { name: "Drag Province" })
    dragHandle.focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{Enter}")
    const rowsWell = within(canvas.getByRole("group", { name: "Rows" }))
    await waitFor(async () => {
      await expect(
        rowsWell.getByRole("row", { name: /province/i })
      ).toBeInTheDocument()
    })
  },
}

/*
 * Stateful story rendered through a wrapper component, which Storybook's
 * "Show code" cannot expand — carries an explicit, copyable docs.source
 * snippet instead (test readout omitted).
 */
const configuredWellsSource = `
function ConfiguredWells() {
  const [value, setValue] = React.useState<FieldWellValue>({
    rows: [],
    columns: [],
    values: [],
  })
  return (
    <div className="flex flex-col gap-4">
      <FieldWellGroup
        aria-label="Pivot fields"
        fields={fields}
        wells={wells}
        value={value}
        onValueChange={setValue}
      />
      <pre data-testid="wells-readout">
        {JSON.stringify(
          Object.fromEntries(
            Object.entries(value).map(([id, items]) => [
              id,
              items.map((field) => field.id),
            ])
          )
        )}
      </pre>
    </div>
  )
}
`.trim()

function ConfiguredWells() {
  const [value, setValue] = React.useState<FieldWellValue>({
    rows: [],
    columns: [],
    values: [],
  })
  return (
    <div className="flex flex-col gap-4">
      <FieldWellGroup
        aria-label="Pivot fields"
        fields={fields}
        wells={wells}
        value={value}
        onValueChange={setValue}
      />
      <pre data-testid="wells-readout" className="text-xs text-muted-foreground">
        {JSON.stringify(
          Object.fromEntries(
            Object.entries(value).map(([id, items]) => [
              id,
              items.map((field) => field.id),
            ])
          )
        )}
      </pre>
    </div>
  )
}

export const ConfiguredWellsStory: Story = {
  name: "ConfiguredWells",
  render: () => <ConfiguredWells />,
  parameters: {
    docs: { source: { code: configuredWellsSource, language: "tsx" } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    /*
     * react-aria keyboard drag mode, discovered empirically against this
     * story (matches the react-aria/dnd en-US strings): focus the row's
     * "Drag <label>" handle button (required for every draggable
     * GridListItem — react-aria warns and keyboard/AT drag silently fails
     * without one), press Enter to start ("Started dragging. Press Tab to
     * navigate to a drop target, then press Enter to drop, or press Escape
     * to cancel"). react-aria auto-focuses the nearest valid drop target on
     * drag start — here that's the Rows well's root (first accepting well
     * in DOM order) — so a second Enter drops immediately; Tab would cycle
     * to further targets (Columns, Values, or between-item positions) first.
     */
    const dragHandle = canvas.getByRole("button", { name: "Drag Province" })
    dragHandle.focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{Enter}")
    await waitFor(() => {
      expect(canvas.getByTestId("wells-readout").textContent).toContain(
        '"rows":["province"]'
      )
    })
    const rowsWell = within(canvas.getByRole("group", { name: "Rows" }))
    const chip = await rowsWell.findByRole("row", { name: /province/i })
    await expect(
      within(chip).getByRole("button", { name: "Remove Province from Rows" })
    ).toBeInTheDocument()
    await userEvent.click(
      within(chip).getByRole("button", { name: "Remove Province from Rows" })
    )
    await waitFor(() => {
      expect(canvas.getByTestId("wells-readout").textContent).toContain(
        '"rows":[]'
      )
    })
  },
}

function BuildsPivotConfigDemo() {
  const [value, setValue] = React.useState<FieldWellValue>({
    rows: [fields[1]],
    columns: [],
    values: [fields[3]],
  })
  const config = pivotConfigFromWells(value, {
    rows: "rows",
    columns: "columns",
    values: "values",
  })
  return (
    <div className="flex flex-col gap-4">
      <FieldWellGroup
        aria-label="Pivot fields"
        fields={fields}
        wells={wells}
        value={value}
        onValueChange={setValue}
      />
      {config ? (
        <PivotTable data={reporting} config={config} caption="Reports by district" />
      ) : (
        <p className="text-sm text-muted-foreground">
          Drag a dimension into Rows and a measure into Values to build a table.
        </p>
      )}
    </div>
  )
}

function TwoGroupsDemo() {
  const [valueA, setValueA] = React.useState<FieldWellValue>({
    rows: [fields[0]],
    columns: [],
    values: [],
  })
  const [valueB, setValueB] = React.useState<FieldWellValue>({
    rows: [],
    columns: [],
    values: [],
  })
  const readout = (value: FieldWellValue) =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(value).map(([id, items]) => [
          id,
          items.map((field) => field.id),
        ])
      )
    )
  return (
    <div className="flex flex-col gap-6">
      <FieldWellGroup
        aria-label="Group A fields"
        fields={fields}
        wells={wells}
        value={valueA}
        onValueChange={setValueA}
      />
      <FieldWellGroup
        aria-label="Group B fields"
        fields={fields}
        wells={wells}
        value={valueB}
        onValueChange={setValueB}
      />
      <pre data-testid="group-a-readout" className="text-xs text-muted-foreground">
        {readout(valueA)}
      </pre>
      <pre data-testid="group-b-readout" className="text-xs text-muted-foreground">
        {readout(valueB)}
      </pre>
    </div>
  )
}

export const CrossGroupDrag: Story = {
  render: () => <TwoGroupsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Two independent FieldWellGroup instances on one page. react-aria DnD is app-global and both groups share the application/x-nhic-field payload type, so a cross-group drop must be treated as a copy (never a move) — the source group's field must survive.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const groupA = within(canvas.getByRole("group", { name: "Group A fields" }))
    const groupB = within(canvas.getByRole("group", { name: "Group B fields" }))
    const groupARows = within(groupA.getByRole("group", { name: "Rows" }))
    const groupBRows = within(groupB.getByRole("group", { name: "Rows" }))

    /*
     * Keyboard drag from group A's populated Rows well into group B's Rows
     * well. react-aria auto-focuses the spatially nearest valid drop target
     * on drag start — with two stacked groups that lands on group A's own
     * Rows well (a self-reorder target), not group B's — so unlike the
     * single-group ConfiguredWells story (one Enter to drop), this needs a
     * Tab press per intervening target to walk down to group B's Rows well
     * before the second Enter. Sequence discovered empirically against this
     * story's DOM order: Rows(A) -> Columns(A) -> Values(A) -> Rows(B).
     */
    const dragHandle = groupARows.getByRole("button", { name: "Drag Province" })
    dragHandle.focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{Tab}{Tab}{Tab}")
    await userEvent.keyboard("{Enter}")

    await waitFor(() => {
      expect(canvas.getByTestId("group-b-readout").textContent).toContain(
        '"rows":["province"]'
      )
    })
    await expect(canvas.getByTestId("group-b-readout").textContent).toContain(
      '"columns":[]'
    )
    await expect(canvas.getByTestId("group-b-readout").textContent).toContain(
      '"values":[]'
    )
    await expect(canvas.getByTestId("group-a-readout").textContent).toContain(
      '"rows":["province"]'
    )
    await expect(
      groupBRows.findByRole("row", { name: /province/i })
    ).resolves.toBeInTheDocument()
  },
}

export const BuildsPivotConfig: Story = {
  render: () => <BuildsPivotConfigDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Wells wired through pivotConfigFromWells into a live PivotTable; empty rows or values fall back to hint text.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole("table", { name: "Reports by district" })
    await expect(table).toBeInTheDocument()
    await expect(within(table).getByText("Gasabo")).toBeInTheDocument()
  },
}
