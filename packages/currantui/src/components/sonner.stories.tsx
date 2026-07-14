import { userEvent, waitFor, within } from "storybook/test"

import { Button } from "@nhic/currantui/components/button"
import { Toaster, toast } from "@nhic/currantui/components/sonner"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Sonner",
  component: Toaster,
  parameters: {
    docs: {
      description: {
        component:
          "Toast queue on sonner. `toast.info/success/warning/error(title, { description, action })` renders React Spectrum's Toast anatomy — solid status fill, filled icon, outlined action button, divider, close button — on the status tokens with `--background` as the ink (the AA-checked inverted pairing in both palettes). Neutral `toast()` keeps the glass treatment.",
      },
      // Roomy docs canvases; keep stories inline — iframe rendering
      // (inline: false) feedback-loops with the theme-synced docs container
      // (iframe boot emits globals → docs re-render remounts iframes → boot…)
      story: { height: "360px" },
    },
  },
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toaster />
      <Button
        variant="outline"
        onClick={() => toast.success("Report submitted")}
      >
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.info("Sync scheduled")}>
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Storage almost full")}
      >
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.error("Upload failed")}>
        Error
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Success" }))
    // Toasts render in a portal outside the canvas root
    await waitFor(() =>
      within(document.body).getByText("Report submitted")
    )
  },
}

export const WithDescriptionAndAction: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toaster closeButton />
      <Button
        variant="outline"
        onClick={() =>
          toast.warning("Submission closing soon", {
            description: "4 facilities have not reported this week.",
            action: {
              label: "Remind",
              onClick: () => {},
            },
          })
        }
      >
        Actionable warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Validation failed", {
            description: "12 records failed range checks.",
            action: {
              label: "Review",
              onClick: () => {},
            },
          })
        }
      >
        Actionable error
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Actionable warning" })
    )
    await waitFor(() =>
      within(document.body).getByRole("button", { name: "Remind" })
    )
  },
}

export const Neutral: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast("Export queued", {
            description: "You'll be notified when the file is ready.",
          })
        }
      >
        Neutral
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const id = toast.loading("Uploading week 28 report…")
          setTimeout(() => {
            toast.success("Report uploaded", { id })
          }, 1500)
        }}
      >
        Loading then success
      </Button>
    </div>
  ),
}
