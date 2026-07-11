import { Button } from "@nhic/currantui/components/button"
import { PageHeader } from "@nhic/currantui/components/page-header"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/PageHeader",
  component: PageHeader,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Imaging studies",
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSubtitle: Story = {
  args: { subtitle: "1,204 records" },
}

export const WithActions: Story = {
  args: {
    subtitle: "1,204 records",
    right: <Button size="sm">Export</Button>,
  },
}
