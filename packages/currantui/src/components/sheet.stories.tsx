import { expect, userEvent, within } from "storybook/test"

import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@nhic/currantui/components/sheet"
import { Button } from "@nhic/currantui/components/button"
import { Input } from "@nhic/currantui/components/input"
import { Label } from "@nhic/currantui/components/label"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Sheet",
  component: Sheet,
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

const template = (side: "top" | "right" | "bottom" | "left") => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline">Edit facility</Button>
    </SheetTrigger>
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle>Edit facility</SheetTitle>
        <SheetDescription>
          Update the facility profile; changes sync to the registry on save.
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-3 px-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`sheet-name-${side}`}>Facility name</Label>
          <Input id={`sheet-name-${side}`} defaultValue="Kigali Central" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`sheet-code-${side}`}>Facility code</Label>
          <Input id={`sheet-code-${side}`} defaultValue="HF-0042" />
        </div>
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Cancel</Button>
        </SheetClose>
        <Button>Save changes</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
)

export const Default: Story = {
  render: () => template("right"),
}

export const Open: Story = {
  render: () => template("right"),
  parameters: {
    a11y: {
      config: {
        // Radix Dialog marks the page background aria-hidden while open,
        // which axe flags because the focusable trigger sits inside it
        // (library-level interplay, not story authoring)
        rules: [{ id: "aria-hidden-focus", enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole("button", { name: "Edit facility" })
    )
    // Content renders in a portal outside the canvas root
    await within(document.body).findByRole("dialog", { name: "Edit facility" })
  },
}

export const FromLeft: Story = {
  render: () => template("left"),
}

export const FromBottom: Story = {
  render: () => template("bottom"),
}

export const ScrollableBody: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Facility details</SheetTitle>
        </SheetHeader>
        <SheetBody>
          {Array.from({ length: 60 }, (_, index) => (
            <p key={index}>Attribute {index + 1} of the selected facility.</p>
          ))}
        </SheetBody>
        <SheetFooter>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body
    const screen = within(body)
    const sheetBody = body.querySelector<HTMLElement>(
      '[data-slot="sheet-body"]'
    )!
    expect(sheetBody.scrollHeight).toBeGreaterThan(sheetBody.clientHeight)
    const save = screen.getByRole("button", { name: "Save changes" })
    expect(save.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      window.innerHeight
    )
    await userEvent.click(save)
  },
}

export const BottomCapped: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <SheetBody>
          {Array.from({ length: 60 }, (_, index) => (
            <p key={index}>Filter option {index + 1}.</p>
          ))}
        </SheetBody>
      </SheetContent>
    </Sheet>
  ),
  play: ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body
    const content = body.querySelector<HTMLElement>(
      '[data-slot="sheet-content"]'
    )!
    expect(content.getBoundingClientRect().height).toBeLessThanOrEqual(
      window.innerHeight - 64 + 1
    )
  },
}
