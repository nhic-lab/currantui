import {
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@phosphor-icons/react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@nhic/currantui/components/toggle-group"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/ToggleGroup",
  component: ToggleGroup,
  args: {
    type: "multiple",
  },
  argTypes: {
    type: { table: { disable: true } },
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["sm", "default", "lg"] },
  },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

const formattingItems = (
  <>
    <ToggleGroupItem value="bold" aria-label="Bold">
      <TextBIcon />
    </ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Italic">
      <TextItalicIcon />
    </ToggleGroupItem>
    <ToggleGroupItem value="underline" aria-label="Underline">
      <TextUnderlineIcon />
    </ToggleGroupItem>
  </>
)

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["bold"]}>
      {formattingItems}
    </ToggleGroup>
  ),
}

export const Single: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="7d" variant="outline">
      <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
      <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
      <ToggleGroupItem value="90d">Quarter</ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Attached: Story = {
  render: () => (
    <ToggleGroup
      type="multiple"
      variant="outline"
      spacing={0}
      defaultValue={["bold", "italic"]}
    >
      {formattingItems}
    </ToggleGroup>
  ),
}
