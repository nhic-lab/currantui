import { expect, userEvent, waitFor, within } from "storybook/test"
import { BarChart as BarSeries } from "echarts/charts"
import { GridComponent, TooltipComponent } from "echarts/components"
import * as echarts from "echarts/core"

import { ChartShell } from "@nhic/currantui-charts/components/chart-shell"
import {
  baseGrid,
  baseTooltip,
  categoryAxis,
  groupsOf,
  keysOf,
  valueAxis,
  valuesByGroup,
} from "@nhic/currantui-charts/lib/option-base"
import { groupedRowColumns } from "@nhic/currantui-charts/lib/table-columns"
import { paletteVar } from "@nhic/currantui-charts/lib/theme"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ChartBuildContext } from "@nhic/currantui-charts/components/chart-shell"
import type { ChartDataRow } from "@nhic/currantui-charts/lib/types"

echarts.use([BarSeries, GridComponent, TooltipComponent])

const rows: Array<ChartDataRow> = [
  { group: "Health centers", key: "Q1", value: 1240 },
  { group: "Health centers", key: "Q2", value: 1418 },
  { group: "Health centers", key: "Q3", value: 1302 },
  { group: "District hospitals", key: "Q1", value: 486 },
  { group: "District hospitals", key: "Q2", value: 512 },
  { group: "District hospitals", key: "Q3", value: 547 },
]

const tableColumns = groupedRowColumns({ key: "Quarter", value: "Referrals" })

const legendItems = groupsOf(rows).map((group, index) => ({
  label: group,
  color: paletteVar(index),
}))

const buildOption = ({ hiddenGroups }: ChartBuildContext) => {
  const groups = groupsOf(rows)
  const keys = keysOf(rows)
  const values = valuesByGroup(rows, groups, keys)
  return {
    grid: baseGrid({ left: true, bottom: true }),
    tooltip: { trigger: "axis" as const, ...baseTooltip() },
    xAxis: categoryAxis(keys.map(String), { label: "Quarter" }),
    yAxis: valueAxis({ label: "Referrals" }),
    series: groups.map((group) => ({
      name: group,
      type: "bar" as const,
      data: hiddenGroups.has(group) ? [] : (values.get(group) ?? []),
      barMaxWidth: 48,
    })),
  }
}

const meta = {
  title: "Charts/ChartShell",
  component: ChartShell,
  parameters: {
    docs: {
      description: {
        component:
          "Shared card around every chart: title header, toolbar (table view, fullscreen, CSV/PNG/JPG export), HTML legend, and a source/attribution footer. Chart components compose it; use it directly only for custom chart types.",
      },
    },
  },
  args: {
    options: { title: "Referrals by quarter", source: "HMIS 2025" },
    rows,
    tableColumns,
    legendItems,
    buildOption,
  },
} satisfies Meta<typeof ChartShell<ChartDataRow>>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TableToggle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole("button", { name: "Show table view" })
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute("aria-pressed", "true")
    const table = await canvas.findByRole("table")
    await expect(within(table).getAllByRole("row").length).toBeGreaterThan(1)
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute("aria-pressed", "false")
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}

export const ExportMenu: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "More options" })
    await userEvent.click(trigger)
    const menu = await body.findByRole("menu")
    await expect(within(menu).getAllByRole("menuitem")).toHaveLength(3)
    // Close by re-clicking the trigger; Escape reloads the vitest iframe.
    // While the menu is open Radix sets pointer-events: none outside it and
    // routes the trigger click via capture, so skip the strict check.
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    await user.click(trigger)
    await waitFor(() => expect(body.queryByRole("menu")).not.toBeInTheDocument())
  },
}

export const ExportCsv: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const downloads: Array<string> = []
    const originalClick = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
      downloads.push(this.download)
    }
    try {
      await userEvent.click(canvas.getByRole("button", { name: "More options" }))
      await userEvent.click(
        await body.findByRole("menuitem", { name: "Export as CSV" })
      )
      await expect(downloads).toEqual(["referrals-by-quarter.csv"])
    } finally {
      HTMLAnchorElement.prototype.click = originalClick
    }
  },
}

export const Fullscreen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole("button", { name: "Fullscreen" }))
    const dialog = await body.findByRole("dialog")
    // findByRole retries while the dialog content mounts — slow CI runners
    // rendered the frame after the assertion under plain getByRole
    await expect(
      await within(dialog).findByRole("button", { name: "Show table view" })
    ).toBeVisible()
    // The toolbar button toggles: pressed in the dialog, and clicking it
    // closes fullscreen (never Escape — it reloads the vitest iframe)
    const exit = within(dialog).getByRole("button", { name: "Fullscreen" })
    await expect(exit).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(exit)
    await waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument())
  },
}
