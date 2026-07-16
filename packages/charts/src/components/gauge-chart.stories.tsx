import { expect, userEvent, waitFor, within } from "storybook/test"

import { GaugeChart } from "@nhic/currantui-charts/components/gauge-chart"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Charts/GaugeChart",
  component: GaugeChart,
  parameters: {
    docs: {
      description: {
        component:
          "Gauge for one value against a bounded range. Optional thresholds tint the track by status zone and color the progress arc with the current zone's tone; the headline value is an HTML overlay.",
      },
    },
  },
  args: {
    data: [{ value: 78 }],
    options: {
      title: "DTP3 coverage",
      source: "EPI program 2026",
      caption: "of target population",
      valueFormatter: (value: number) => `${value}%`,
      valueLabel: "Coverage (%)",
    },
  },
} satisfies Meta<typeof GaugeChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("78%")).toBeVisible()
    await expect(canvas.getByText("of target population")).toBeVisible()
  },
}

export const WithThresholds: Story = {
  args: {
    data: [{ value: 62 }],
    options: {
      title: "Reporting completeness",
      source: "HMIS 2026",
      caption: "facilities reporting on time",
      thresholds: [
        { upTo: 50, tone: "destructive" },
        { upTo: 80, tone: "warning" },
        { upTo: 100, tone: "success" },
      ],
      valueFormatter: (value: number) => `${value}%`,
      valueLabel: "Completeness (%)",
    },
  },
}

export const Loading: Story = {
  args: {
    options: {
      title: "DTP3 coverage",
      source: "EPI program 2026",
      loading: true,
    },
  },
}

export const Empty: Story = {
  args: {
    data: [],
    options: {
      title: "DTP3 coverage",
      source: "EPI program 2026",
    },
  },
}

export const TableView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    const table = await canvas.findByRole("table")
    await expect(within(table).getByText("Coverage (%)")).toBeVisible()
    await expect(within(table).getByText("78")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Show table view" }))
    await waitFor(() => expect(canvas.queryByRole("table")).not.toBeInTheDocument())
  },
}
