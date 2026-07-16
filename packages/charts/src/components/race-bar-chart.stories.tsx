import { expect, userEvent, waitFor, within } from "storybook/test"

import { RaceBarChart } from "@nhic/currantui-charts/components/race-bar-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ChartDataRow } from "@nhic/currantui-charts/lib/types"

const conditions = [
  "Malaria",
  "Respiratory infections",
  "Diarrheal disease",
  "Hypertension",
  "Diabetes",
  "Road injuries",
]
const yearlyVisits = [
  [412, 268, 190, 84, 61, 45],
  [386, 291, 174, 102, 78, 52],
  [341, 322, 168, 127, 96, 58],
  [297, 356, 152, 148, 118, 66],
  [242, 371, 149, 173, 141, 71],
  [208, 389, 137, 196, 168, 79],
]
const visitTrends: Array<ChartDataRow> = yearlyVisits.flatMap((row, year) =>
  row.map((value, i) => ({
    group: conditions[i],
    key: 2019 + year,
    value: value * 1000,
  }))
)

const meta = {
  title: "Charts/RaceBarChart",
  component: RaceBarChart,
  parameters: {
    docs: {
      description: {
        component:
          "Animated bar race: horizontal bars re-rank as the animation steps through the frames in `key` order (e.g. years). Colors stay bound to their group across frames; playback is controlled below the chart and the table view carries every frame's rows.",
      },
    },
  },
  args: {
    data: visitTrends,
    options: {
      title: "Outpatient visits by condition",
      source: "HMIS 2019–2024",
      frameLabel: "Year",
      xAxis: { label: "Visits" },
    },
  },
} satisfies Meta<typeof RaceBarChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TopThree: Story = {
  args: {
    options: {
      title: "Leading causes of outpatient visits",
      source: "HMIS 2019–2024",
      topN: 3,
      frameLabel: "Year",
      xAxis: { label: "Visits" },
    },
  },
}

export const Paused: Story = {
  args: {
    options: {
      title: "Outpatient visits by condition",
      source: "HMIS 2019–2024",
      autoplay: false,
      frameLabel: "Year",
      xAxis: { label: "Visits" },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const play = canvas.getByRole("button", { name: "Play animation" })
    await expect(canvas.getByText("2019 · 1/6")).toBeVisible()
    await userEvent.click(play)
    await expect(
      canvas.getByRole("button", { name: "Pause animation" })
    ).toBeVisible()
    // Stop again so the story settles deterministically
    await userEvent.click(canvas.getByRole("button", { name: "Pause animation" }))
    await expect(
      canvas.getByRole("button", { name: "Play animation" })
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: {
    options: {
      title: "Outpatient visits by condition",
      source: "HMIS 2019–2024",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "Outpatient visits by condition",
      source: "HMIS 2019–2024",
    },
  },
}

export const TableView: Story = {
  args: {
    options: {
      title: "Outpatient visits by condition",
      source: "HMIS 2019–2024",
      autoplay: false,
      frameLabel: "Year",
      xAxis: { label: "Visits" },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(within(table).getAllByText("Malaria")).toHaveLength(6)
    await expect(within(table).getByText("412,000")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
