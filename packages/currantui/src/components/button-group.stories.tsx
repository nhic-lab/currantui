import { CaretDownIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"

import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@nhic/currantui/components/button-group"
import { Button } from "@nhic/currantui/components/button"
import { Input } from "@nhic/currantui/components/input"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
    </ButtonGroup>
  ),
}

export const SplitButton: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Export report</Button>
      <ButtonGroupSeparator />
      <Button size="icon" aria-label="More export options">
        <CaretDownIcon />
      </Button>
    </ButtonGroup>
  ),
}

export const WithInput: Story = {
  render: (args) => (
    <ButtonGroup {...args} className="w-80">
      <ButtonGroupText asChild>
        <label htmlFor="bg-search">
          <MagnifyingGlassIcon />
        </label>
      </ButtonGroupText>
      <Input id="bg-search" placeholder="Search facilities…" />
      <Button variant="outline">Search</Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Approve</Button>
      <Button variant="outline">Return for revision</Button>
      <Button variant="outline">Escalate</Button>
    </ButtonGroup>
  ),
}
