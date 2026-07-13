import { Label } from "@nhic/currantui/components/label"
import { Textarea } from "@nhic/currantui/components/textarea"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: {
    "aria-label": "Notes",
    placeholder: "Add reviewer notes…",
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="review-notes">Reviewer notes</Label>
      <Textarea {...args} aria-label={undefined} id="review-notes" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "Entry exceeds 500 characters" },
}
