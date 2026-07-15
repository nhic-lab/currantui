import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
} from "@phosphor-icons/react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@nhic/currantui/components/alert"
import { Button } from "@nhic/currantui/components/button"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          "Inline status messaging that stays on the page — callouts, inline notifications, form-level errors. For transient toasts use the sonner Toaster instead.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "success", "warning", "info"],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="w-96">
      <InfoIcon />
      <AlertTitle>Reporting window open</AlertTitle>
      <AlertDescription>
        Weekly submissions are accepted until Thursday 18:00.
      </AlertDescription>
    </Alert>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-2">
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>
          The registry sync pauses Sunday 02:00–04:00.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircleIcon />
        <AlertTitle>Report submitted</AlertTitle>
        <AlertDescription>
          Week 28 data passed validation and is now in review.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <WarningIcon />
        <AlertTitle>Submission closing soon</AlertTitle>
        <AlertDescription>
          4 facilities have not reported; the window closes in 6 hours.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <XCircleIcon />
        <AlertTitle>Validation failed</AlertTitle>
        <AlertDescription>
          12 records failed range checks and were not accepted.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Alert variant="warning" className="w-96">
      <WarningIcon />
      <AlertTitle>Submission closing soon</AlertTitle>
      <AlertDescription>
        4 facilities have not reported this week.
      </AlertDescription>
      <AlertAction>
        <Button variant="outline" size="xs">
          Remind
        </Button>
      </AlertAction>
    </Alert>
  ),
}

export const TitleOnly: Story = {
  render: () => (
    <Alert variant="success" className="w-96">
      <CheckCircleIcon />
      <AlertTitle>All districts reported on time this week</AlertTitle>
    </Alert>
  ),
}
