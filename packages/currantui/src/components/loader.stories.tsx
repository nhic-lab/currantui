import { Loader, LoaderOverlay } from "@nhic/currantui/components/loader"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Loader",
  component: Loader,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Loader {...args} size="xs" />
      <Loader {...args} size="sm" />
      <Loader {...args} size="md" />
      <Loader {...args} size="lg" />
      <Loader {...args} size="xl" />
    </div>
  ),
}

export const Overlay: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative h-48">
      <LoaderOverlay className="absolute" label="Loading study" />
    </div>
  ),
}
