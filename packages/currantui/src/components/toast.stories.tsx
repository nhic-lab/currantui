import { userEvent, waitFor, within } from "storybook/test"

import { Button } from "@nhic/currantui/components/button"
import { Toaster, toast } from "@nhic/currantui/components/toast"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Toast",
  component: Toaster,
  parameters: {
    docs: {
      description: {
        component:
          "Transient notifications on a react-aria toast queue: solid status fills for info/success/warning/error, a neutral glass toast, and a pinned loading fill that resolves in place. Timers pause on hover or focus, at most three toasts show at once, and actionable toasts never auto-dismiss.",
      },
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
    await waitFor(() => within(document.body).getByText("Report submitted"))
  },
}

export const WithDescriptionAndAction: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toaster />
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

export const LargeDescription: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast.info("Quarterly data submission opens Monday", {
            size: "lg",
            description:
              "All district facilities must submit Q3 service statistics between 21 and 25 July. Records failing range or completeness checks are returned to the facility focal person for correction, and resubmissions close on 28 July at 17:00.",
            action: {
              label: "View schedule",
              onClick: () => {},
            },
          })
        }
      >
        Large description
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Large description" })
    )
    await waitFor(() =>
      within(document.body).getByRole("button", { name: "View schedule" })
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Neutral" }))
    await waitFor(() => within(document.body).getByText("Export queued"))
  },
}
