import { InfoIcon } from "@phosphor-icons/react"

import { Button } from "@nhic/currantui/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@nhic/currantui/components/tooltip"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Study last synced 5 minutes ago</TooltipContent>
    </Tooltip>
  ),
}

export const OnIconButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="About this metric">
          <InfoIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Counts distinct patients, not visits</TooltipContent>
    </Tooltip>
  ),
}
