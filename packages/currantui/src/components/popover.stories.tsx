import { expect, userEvent, within } from "storybook/test"

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@nhic/currantui/components/popover"
import { Button } from "@nhic/currantui/components/button"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

const template = (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">Submission window</Button>
    </PopoverTrigger>
    <PopoverContent aria-label="Submission window details">
      <PopoverHeader>
        <PopoverTitle>Weekly submission window</PopoverTitle>
        <PopoverDescription>
          Facilities can submit reports from Monday 06:00 until Thursday 18:00.
          Late entries require district approval.
        </PopoverDescription>
      </PopoverHeader>
    </PopoverContent>
  </Popover>
)

export const Default: Story = {
  render: () => template,
}

export const Open: Story = {
  render: () => template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole("button", { name: "Submission window" })
    )
    // Content renders in a portal outside the canvas root
    await within(document.body).findByText("Weekly submission window")
  },
}

export const Overflowing: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Definitions</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Indicator definitions">
        <PopoverHeader>
          <PopoverTitle>Indicator definitions</PopoverTitle>
        </PopoverHeader>
        {Array.from({ length: 60 }, (_, index) => (
          <p key={index}>Indicator {index + 1}: routine reporting metric.</p>
        ))}
      </PopoverContent>
    </Popover>
  ),
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            // The scrollable content is the dialog panel itself, which Radix
            // focuses on open (tabindex="-1"); axe only recognizes elements
            // in the natural tab order (tabindex >= 0) as focusable, so it
            // can't see that runtime focus management already makes this
            // region keyboard-operable (library-level interplay, not story
            // authoring)
            id: "scrollable-region-focusable",
            enabled: false,
          },
        ],
      },
    },
  },
  play: ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body
    const content = body.querySelector<HTMLElement>(
      '[data-slot="popover-content"]'
    )!
    const rect = content.getBoundingClientRect()
    // Capped to the viewport and scrollable inside
    expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight + 1)
    expect(rect.top).toBeGreaterThanOrEqual(-1)
    expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
  },
}
