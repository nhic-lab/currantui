import { expect, within } from "storybook/test"

import { Stepper, StepperItem } from "@nhic/currantui/components/stepper"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  parameters: {
    docs: {
      description: {
        component:
          "Multi-step progress indicator for setup flows and wizards. The current step carries `aria-current=\"step\"`; completed and failed steps announce their state to screen readers.",
      },
    },
  },
  args: {
    "aria-label": "Onboarding progress",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Stepper {...args} className="w-xl">
      <StepperItem state="complete" title="Facility profile" />
      <StepperItem state="complete" title="Reporting periods" />
      <StepperItem state="current" title="Data sources" />
      <StepperItem title="Review" />
    </Stepper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const steps = canvas.getAllByRole("listitem")

    await expect(steps).toHaveLength(4)
    await expect(steps[2]).toHaveAttribute("aria-current", "step")
  },
}

export const WithDescriptions: Story = {
  render: (args) => (
    <Stepper {...args} className="w-xl">
      <StepperItem
        state="complete"
        title="Facility profile"
        description="Name, district, and contact"
      />
      <StepperItem
        state="current"
        title="Reporting periods"
        description="Weekly and quarterly cadence"
      />
      <StepperItem
        title="Data sources"
        description="Registries and upload formats"
      />
    </Stepper>
  ),
}

export const WithError: Story = {
  render: (args) => (
    <Stepper {...args} className="w-xl">
      <StepperItem state="complete" title="Facility profile" />
      <StepperItem
        state="invalid"
        title="Reporting periods"
        description="Overlapping periods found"
      />
      <StepperItem state="current" title="Data sources" />
      <StepperItem title="Review" disabled />
    </Stepper>
  ),
}

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <Stepper {...args}>
      <StepperItem
        state="complete"
        title="Facility profile"
        description="Name, district, and contact"
      />
      <StepperItem
        state="current"
        title="Reporting periods"
        description="Weekly and quarterly cadence"
      />
      <StepperItem title="Data sources" />
      <StepperItem title="Review" />
    </Stepper>
  ),
}
