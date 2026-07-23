import { expect, within } from "storybook/test"

import { Label } from "@nhic/currantui/components/label"
import { Textarea } from "@nhic/currantui/components/textarea"

import type { Meta, StoryObj } from "@storybook/react-vite"

const longText = Array.from(
  { length: 40 },
  (_, index) => `Line ${index + 1} of the facility report notes.`
).join("\n")

const meta = {
  title: "Components/Forms/Textarea",
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

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea size="sm" aria-label="Small" defaultValue={longText} />
      <Textarea size="md" aria-label="Medium" defaultValue={longText} />
      <Textarea size="lg" aria-label="Large" defaultValue={longText} />
    </div>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const caps = { Small: 128, Medium: 192, Large: 288 }
    for (const [label, cap] of Object.entries(caps)) {
      const textarea = canvas.getByLabelText(label)
      // Growth stops at the size cap; content scrolls internally
      expect(textarea.clientHeight).toBeLessThanOrEqual(cap + 1)
      expect(textarea.scrollHeight).toBeGreaterThan(textarea.clientHeight)
    }
  },
}
