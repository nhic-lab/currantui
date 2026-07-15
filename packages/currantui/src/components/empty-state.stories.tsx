import { FunnelIcon, MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react"

import { EmptyState } from "@nhic/currantui/components/empty-state"
import { Button } from "@nhic/currantui/components/button"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component:
          "Centered placeholder for a view with nothing to show — no results, no data yet, cleared filters. For full-page failures use ErrorPage; inside tables, TableEmptyState.",
      },
    },
  },
  args: {
    title: "No reports yet",
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: <MagnifyingGlassIcon />,
    title: "No results found",
    description:
      "No facilities match the current search. Try a different name or district.",
  },
}

export const WithActions: Story = {
  render: () => (
    <EmptyState
      icon={<PlusIcon />}
      title="No reports yet"
      description="Reports appear here once a facility submits its first reporting period."
    >
      <Button>
        <PlusIcon data-icon="inline-start" />
        New report
      </Button>
      <Button variant="ghost">Import data</Button>
    </EmptyState>
  ),
}

export const ClearedFilters: Story = {
  render: () => (
    <EmptyState
      icon={<FunnelIcon />}
      title="Nothing matches these filters"
      description="Widen the period or clear a filter to see submissions again."
    >
      <Button variant="outline">Clear filters</Button>
    </EmptyState>
  ),
}

export const TitleOnly: Story = {}
