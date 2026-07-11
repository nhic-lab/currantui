import { HouseIcon } from "@phosphor-icons/react"

import { Button } from "@nhic/currantui/components/button"
import { SidebarItem } from "@nhic/currantui/components/sidebar-item"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/SidebarItem",
  component: SidebarItem,
} satisfies Meta<typeof SidebarItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Dashboard",
    children: (
      <Button variant="ghost" size="icon" aria-label="Dashboard">
        <HouseIcon />
      </Button>
    ),
  },
}
