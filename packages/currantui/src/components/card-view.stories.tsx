import { expect, userEvent, waitFor, within } from "storybook/test"

import { StatusLight } from "@nhic/currantui/components/status-light"
import { CardView, CardViewItem } from "@nhic/currantui/components/card-view"
import { LabeledValue } from "@nhic/currantui/components/labeled-value"
import { CardCover } from "@nhic/currantui/components/card"

import type { Meta, StoryObj } from "@storybook/react-vite"

const districts = [
  { id: "gasabo", name: "Gasabo", facilities: 112, onTime: "94%", published: true },
  { id: "kicukiro", name: "Kicukiro", facilities: 87, onTime: "97%", published: true },
  { id: "nyarugenge", name: "Nyarugenge", facilities: 64, onTime: "91%", published: false },
  { id: "musanze", name: "Musanze", facilities: 78, onTime: "88%", published: true },
]

const meta = {
  title: "Components/CardView",
  component: CardView,
  parameters: {
    docs: {
      description: {
        component:
          "Card grid with two-dimensional keyboard navigation and optional selection — arrow keys move between cards. Items are unpadded so covers can bleed to the edges; compose CardCover + a padded body.",
      },
    },
  },
} satisfies Meta<typeof CardView>

export default meta
type Story = StoryObj<typeof meta>

const cards = districts.map((district) => (
  <CardViewItem key={district.id} id={district.id} textValue={district.name}>
    <CardCover className="mt-0 h-20 bg-linear-to-tr from-primary-deep via-primary to-primary/40" />
    <div className="flex flex-1 flex-col gap-1 p-4">
      <span className="font-heading text-sm font-semibold tracking-tight">
        {district.name}
      </span>
      <div className="flex gap-4">
        <LabeledValue label="Facilities">{district.facilities}</LabeledValue>
        <LabeledValue label="On time">{district.onTime}</LabeledValue>
      </div>
      <StatusLight
        className="mt-2"
        variant={district.published ? "success" : "warning"}
      >
        {district.published ? "Published" : "Awaiting approval"}
      </StatusLight>
    </div>
  </CardViewItem>
))

export const Default: Story = {
  render: () => (
    <CardView aria-label="Districts" className="w-full max-w-2xl">
      {cards}
    </CardView>
  ),
}

export const MultipleSelection: Story = {
  render: () => (
    <CardView
      aria-label="Districts"
      selectionMode="multiple"
      defaultSelectedKeys={["gasabo"]}
      className="w-full max-w-2xl"
    >
      {cards}
    </CardView>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByRole("row", { name: /musanze/i })
    await userEvent.click(card)
    await waitFor(() => expect(card).toHaveAttribute("aria-selected", "true"))
  },
}

export const Empty: Story = {
  render: () => (
    <CardView
      aria-label="Districts"
      renderEmptyState={() => "No districts match the current filters."}
      className="w-full max-w-2xl"
    >
      {[]}
    </CardView>
  ),
}
