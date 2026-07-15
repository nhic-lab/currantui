import { expect, userEvent, within } from "storybook/test"

import { AiLabel } from "@nhic/currantui/components/ai-label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nhic/currantui/components/card"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/AiLabel",
  component: AiLabel,
  parameters: {
    docs: {
      description: {
        component:
          "Badge marking AI-generated or AI-assisted content. Clicking it opens a bubble whose body — provenance, model, limitations — is fully caller-supplied; never render the label without that explanation.",
      },
    },
  },
  args: {
    title: "AI-generated summary",
    children:
      "This summary was drafted from the facility's submitted indicators and has not been reviewed by an analyst. Verify figures before citing them.",
  },
} satisfies Meta<typeof AiLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-40 items-center justify-center">
      <AiLabel {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole("button", { name: "About this AI-generated content" })
    )
    const dialog = await within(document.body).findByRole("dialog", {
      name: "About this AI-generated content",
    })
    await expect(dialog).toHaveTextContent("AI-generated summary")
  },
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex min-h-40 items-center justify-center gap-2">
      <AiLabel {...args} variant="secondary" />
      <AiLabel {...args} variant="outline" />
      <AiLabel {...args} variant="default" />
    </div>
  ),
}

export const InACard: Story = {
  render: (args) => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Weekly summary
          <AiLabel {...args} />
        </CardTitle>
        <CardDescription>Gasabo District Hospital — 2026-W28</CardDescription>
      </CardHeader>
      <CardContent>
        OPD visits rose 8% over the previous week, driven by the malaria
        program. No stockouts were reported; referral volume stayed flat.
      </CardContent>
    </Card>
  ),
}
