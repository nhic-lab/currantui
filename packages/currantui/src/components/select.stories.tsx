import { userEvent, within } from "storybook/test"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@nhic/currantui/components/select"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/Select",
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const template = (
  <Select>
    <SelectTrigger aria-label="Modality" className="w-44">
      <SelectValue placeholder="Select modality" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Imaging</SelectLabel>
        <SelectItem value="xray">X-ray</SelectItem>
        <SelectItem value="ct">CT</SelectItem>
        <SelectItem value="mri">MRI</SelectItem>
        <SelectItem value="ultrasound">Ultrasound</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
)

export const Default: Story = {
  render: () => template,
}

export const Open: Story = {
  render: () => template,
  parameters: {
    a11y: {
      config: {
        // Radix Select marks the page background aria-hidden while open,
        // which axe flags because the focusable trigger sits inside it;
        // its scrollable viewport is keyboard-driven through the listbox
        // items rather than the scroll container itself
        // (library-level interplay, not story authoring)
        rules: [
          { id: "aria-hidden-focus", enabled: false },
          { id: "scrollable-region-focusable", enabled: false },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole("combobox", { name: "Modality" })
    )
    // Options render in a portal outside the canvas root
    await within(document.body).findByRole("option", { name: "CT" })
  },
}

export const Small: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" aria-label="Period" className="w-36">
        <SelectValue placeholder="Period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">Last 7 days</SelectItem>
        <SelectItem value="30d">Last 30 days</SelectItem>
        <SelectItem value="90d">Last quarter</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger aria-label="Modality" className="w-44">
        <SelectValue placeholder="Select modality" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="xray">X-ray</SelectItem>
      </SelectContent>
    </Select>
  ),
}
