import { userEvent, within } from "storybook/test"

import { Button } from "@nhic/currantui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@nhic/currantui/components/dialog"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

const template = (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Archive study</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Archive this study?</DialogTitle>
        <DialogDescription>
          The study stays available in the archive and can be restored at any
          time.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter showCloseButton>
        <Button>Archive</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export const Default: Story = {
  render: () => template,
}

export const Open: Story = {
  render: () => template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole("button", { name: "Archive study" })
    )
    // Dialog content renders in a portal outside the canvas root
    await within(document.body).findByRole("dialog")
  },
}
