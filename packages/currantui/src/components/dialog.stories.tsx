import { expect, userEvent, within } from "storybook/test"

import { Button } from "@nhic/currantui/components/button"
import {
  Dialog,
  DialogBody,
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

export const ScrollableBody: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Facility enrollment</DialogTitle>
          <DialogDescription>
            Review every section before submitting.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          {Array.from({ length: 40 }, (_, index) => (
            <p key={index}>
              Section {index + 1} — reporting requirements for district
              facilities, data quality thresholds, and submission deadlines.
            </p>
          ))}
        </DialogBody>
        <DialogFooter>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body
    const screen = within(body)
    const content = body.querySelector<HTMLElement>(
      '[data-slot="dialog-content"]'
    )!
    // The dialog never exceeds the viewport
    expect(content.getBoundingClientRect().height).toBeLessThanOrEqual(
      window.innerHeight
    )
    // The body region scrolls; header/footer stay pinned
    const dialogBody = body.querySelector<HTMLElement>(
      '[data-slot="dialog-body"]'
    )!
    expect(dialogBody.scrollHeight).toBeGreaterThan(dialogBody.clientHeight)
    // The footer is inside the viewport and genuinely clickable
    const submit = screen.getByRole("button", { name: "Submit" })
    expect(submit.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      window.innerHeight
    )
    await userEvent.click(submit)
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="outline">{size}</Button>
          </DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Size {size}</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
}

export const Full: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent size="full">
        <DialogHeader>
          <DialogTitle>Size full</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
  play: ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body
    const content = body.querySelector<HTMLElement>(
      '[data-slot="dialog-content"]'
    )!
    // full caps to the viewport minus the same 2rem margin as the max-height;
    // offsetHeight reads the layout box, unaffected by the in-flight
    // data-open zoom-in-95 transform that getBoundingClientRect would catch
    expect(
      Math.abs(content.offsetHeight - (window.innerHeight - 32))
    ).toBeLessThanOrEqual(2)
  },
}
