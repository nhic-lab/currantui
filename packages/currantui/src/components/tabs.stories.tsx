import { userEvent, within } from "storybook/test"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nhic/currantui/components/tabs"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    defaultValue: "overview",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const panels = (
  <>
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="findings">Findings</TabsTrigger>
      <TabsTrigger value="history">History</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">Summary of the current study.</TabsContent>
    <TabsContent value="findings">Reported findings appear here.</TabsContent>
    <TabsContent value="history">Prior studies for this patient.</TabsContent>
  </>
)

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} className="w-80">
      {panels}
    </Tabs>
  ),
}

export const Line: Story = {
  render: (args) => (
    <Tabs {...args} className="w-80">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="findings">Findings</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Summary of the current study.</TabsContent>
      <TabsContent value="findings">Reported findings appear here.</TabsContent>
      <TabsContent value="history">Prior studies for this patient.</TabsContent>
    </Tabs>
  ),
}

export const Switching: Story = {
  render: (args) => (
    <Tabs {...args} className="w-80">
      {panels}
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("tab", { name: "Findings" }))
    await canvas.findByText("Reported findings appear here.")
  },
}
