import { userEvent, waitFor, within } from "storybook/test"

import { Button } from "@nhic/currantui/components/button"
import { Toaster, toast } from "@nhic/currantui/components/sonner"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Sonner",
  component: Toaster,
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
