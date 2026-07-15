import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  Toggletip,
  ToggletipBody,
  ToggletipContent,
  ToggletipTitle,
  ToggletipTrigger,
} from "@nhic/currantui/components/toggletip"
import { Link } from "@nhic/currantui/components/link"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Toggletip",
  component: Toggletip,
  parameters: {
    docs: {
      description: {
        component:
          "Click-triggered information bubble. Unlike Tooltip (hover-only, plain text) it works on touch, can hold links and rich content, and stays open until dismissed. For a labelled help preset next to a field, use ContextualHelp.",
      },
    },
  },
} satisfies Meta<typeof Toggletip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex min-h-40 items-center justify-center">
      <Toggletip>
        <ToggletipTrigger />
        <ToggletipContent aria-label="Completeness score details">
          <ToggletipTitle>Completeness score</ToggletipTitle>
          <ToggletipBody>
            Share of expected data elements reported for the period, before
            any quality adjustments.
          </ToggletipBody>
        </ToggletipContent>
      </Toggletip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: "More information" })

    await userEvent.click(trigger)
    const dialog = await within(document.body).findByRole("dialog", {
      name: "Completeness score details",
    })
    await expect(dialog).toHaveTextContent("Completeness score")

    /* Re-click the trigger to close (Escape reloads the vitest iframe) */
    await userEvent.click(trigger)
    await waitFor(() =>
      expect(
        within(document.body).queryByRole("dialog")
      ).not.toBeInTheDocument()
    )
  },
}

export const WithLink: Story = {
  render: () => (
    <div className="flex min-h-40 items-center justify-center">
      <Toggletip defaultOpen>
        <ToggletipTrigger aria-label="About timeliness" />
        <ToggletipContent aria-label="About timeliness">
          <ToggletipBody>
            Reports are timely when submitted before the period deadline.{" "}
            <Link href="#timeliness">How it is calculated</Link>
          </ToggletipBody>
        </ToggletipContent>
      </Toggletip>
    </div>
  ),
  play: async () => {
    const body = within(document.body)
    const link = await body.findByRole("link", {
      name: "How it is calculated",
    })

    await expect(link).toHaveAttribute("href", "#timeliness")
  },
}

export const CustomTrigger: Story = {
  render: () => (
    <div className="flex min-h-40 items-center justify-center">
      <Toggletip>
        <ToggletipTrigger asChild>
          <button
            type="button"
            className="text-xs/relaxed text-primary underline-offset-4 hover:underline"
          >
            What counts as a stockout?
          </button>
        </ToggletipTrigger>
        <ToggletipContent aria-label="Stockout definition">
          <ToggletipBody>
            Any tracer commodity unavailable for one full day or more during
            the reporting period.
          </ToggletipBody>
        </ToggletipContent>
      </Toggletip>
    </div>
  ),
}
