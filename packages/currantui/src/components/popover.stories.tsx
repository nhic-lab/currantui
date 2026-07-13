import { userEvent, within } from "storybook/test"

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
