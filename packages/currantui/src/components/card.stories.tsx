import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@nhic/currantui/components/card"
import { Button } from "@nhic/currantui/components/button"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Facility coverage</CardTitle>
        <CardDescription>
          Reporting facilities across all districts
        </CardDescription>
      </CardHeader>
      <CardContent>
        412 of 478 facilities submitted their weekly report on time.
      </CardContent>
    </Card>
  ),
}

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => (
    <Card {...args} className="w-72">
      <CardHeader>
        <CardTitle>Data quality</CardTitle>
        <CardDescription>Completeness of submitted records</CardDescription>
      </CardHeader>
      <CardContent>98.2% of records passed validation this week.</CardContent>
    </Card>
  ),
}

export const WithAction: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
        <CardDescription>Signals requiring review</CardDescription>
        <CardAction>
          <Button variant="outline" size="xs">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>3 open signals across 2 districts.</CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader className="border-b">
        <CardTitle>Weekly summary</CardTitle>
      </CardHeader>
      <CardContent>
        Submission rates held steady; two districts improved after follow-up.
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button variant="ghost" size="sm">
          Dismiss
        </Button>
        <Button size="sm">Open report</Button>
      </CardFooter>
    </Card>
  ),
}
