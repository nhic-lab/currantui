import * as React from "react"

import { expect, userEvent, waitFor, within } from "storybook/test"

import { InlineLoading } from "@nhic/currantui/components/inline-loading"
import { Button } from "@nhic/currantui/components/button"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/InlineLoading",
  component: InlineLoading,
  parameters: {
    docs: {
      description: {
        component:
          "Spinner-plus-text feedback for a short inline operation. Announced as a live region — `status` while loading and on success, `alert` on error. For progress without text, use ProgressCircle.",
      },
    },
  },
  args: {
    status: "loading",
    children: "Saving…",
  },
  argTypes: {
    status: { control: "select", options: ["loading", "success", "error"] },
  },
} satisfies Meta<typeof InlineLoading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Statuses: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <InlineLoading status="loading">Submitting report…</InlineLoading>
      <InlineLoading status="success">Report submitted</InlineLoading>
      <InlineLoading status="error">Submission failed</InlineLoading>
    </div>
  ),
}

function SubmitDemo() {
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success"
  >("idle")

  React.useEffect(() => {
    if (status !== "loading") return
    const timer = setTimeout(() => setStatus("success"), 1200)
    return () => clearTimeout(timer)
  }, [status])

  return (
    <div className="flex h-7 items-center gap-3">
      {status === "idle" ? (
        <Button onClick={() => setStatus("loading")}>Submit</Button>
      ) : (
        <InlineLoading status={status === "loading" ? "loading" : "success"}>
          {status === "loading" ? "Submitting…" : "Submitted"}
        </InlineLoading>
      )}
    </div>
  )
}

export const ReplacingAButton: Story = {
  render: () => <SubmitDemo />,
  parameters: {
    docs: {
      source: {
        code: `function SubmitRow() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">("idle")

  React.useEffect(() => {
    if (status !== "loading") return
    const timer = setTimeout(() => setStatus("success"), 1200)
    return () => clearTimeout(timer)
  }, [status])

  return (
    <div className="flex h-7 items-center gap-3">
      {status === "idle" ? (
        <Button onClick={() => setStatus("loading")}>Submit</Button>
      ) : (
        <InlineLoading status={status === "loading" ? "loading" : "success"}>
          {status === "loading" ? "Submitting…" : "Submitted"}
        </InlineLoading>
      )}
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: "Submit" }))
    await expect(canvas.getByRole("status")).toHaveTextContent("Submitting…")
    await waitFor(
      () => expect(canvas.getByRole("status")).toHaveTextContent("Submitted"),
      { timeout: 3000 }
    )
  },
}
