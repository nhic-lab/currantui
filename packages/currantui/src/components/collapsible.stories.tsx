import { CaretDownIcon } from "@phosphor-icons/react"
import { userEvent, within } from "storybook/test"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@nhic/currantui/components/collapsible"
import { Button } from "@nhic/currantui/components/button"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

const template = (defaultOpen?: boolean) => (
  <Collapsible defaultOpen={defaultOpen} className="flex w-80 flex-col gap-2">
    <CollapsibleTrigger asChild>
      <Button
        variant="ghost"
        className="justify-between aria-expanded:[&_svg]:rotate-180 [&_svg]:transition-transform"
      >
        Validation details
        <CaretDownIcon />
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent className="rounded-md border px-2 py-1.5 text-xs/relaxed text-muted-foreground">
      12 records failed range checks; 3 records reference retired facility
      codes. Full detail is available in the validation export.
    </CollapsibleContent>
  </Collapsible>
)

export const Default: Story = {
  render: () => template(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Validation details" })
    )
    await canvas.findByText(/12 records failed range checks/)
  },
}

export const DefaultOpen: Story = {
  render: () => template(true),
}
