import { userEvent, within } from "storybook/test"

import {
  Sheet,
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
