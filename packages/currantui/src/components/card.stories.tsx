import {
  ChartLineUpIcon,
  DotsThreeIcon,
  LightningIcon,
  TrendUpIcon,
} from "@phosphor-icons/react"

import { StatusLight } from "@nhic/currantui/components/status-light"
import {
  Card,
  CardAction,
  CardContent,
  CardCover,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@nhic/currantui/components/card"
import { Avatar, AvatarFallback } from "@nhic/currantui/components/avatar"
import { Skeleton } from "@nhic/currantui/components/skeleton"
import { Button } from "@nhic/currantui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nhic/currantui/components/dropdown-menu"

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

export const WithCover: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardCover className="bg-linear-to-tr from-primary-deep via-primary to-primary/40" />
      <CardHeader>
        <CardTitle>Weekly surveillance digest</CardTitle>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Card actions">
                <DotsThreeIcon weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Open report</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
        <CardDescription>
          Concise overview of this week's signals, submission coverage, and
          data-quality checks across all districts.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <StatusLight variant="success">Published</StatusLight>
      </CardFooter>
    </Card>
  ),
}

export const Profile: Story = {
  render: (args) => (
    <Card {...args} className="w-72">
      <CardCover className="h-20 bg-linear-to-tr from-primary-deep via-primary to-primary/40" />
      <Avatar className="-mt-11 ms-4 size-14 ring-4 ring-card">
        <AvatarFallback className="text-sm">SC</AvatarFallback>
      </Avatar>
      <CardHeader>
        <CardTitle>Simone Carter</CardTitle>
        <CardDescription>
          District data manager for Gasabo. Coordinates weekly facility
          submissions and validation follow-ups.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <StatusLight variant="success">Available</StatusLight>
      </CardFooter>
    </Card>
  ),
}

export const Stat: Story = {
  render: (args) => (
    <Card {...args} className="w-72">
      <CardCover className="flex items-center justify-center bg-linear-to-tr from-primary-deep via-primary to-primary/40">
        <ChartLineUpIcon
          aria-hidden="true"
          className="size-10 text-primary-foreground/90"
        />
      </CardCover>
      <CardContent className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs/relaxed text-muted-foreground">
          <TrendUpIcon aria-hidden="true" className="size-4" />
          On-time submission rate
        </span>
        <span className="flex flex-col items-end">
          <span className="font-heading text-base font-semibold tracking-tight tabular-nums">
            86.2%
          </span>
          <span className="text-[0.625rem] text-success tabular-nums">
            +4.1% vs last week
          </span>
        </span>
      </CardContent>
    </Card>
  ),
}

export const Product: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardCover className="h-20 bg-linear-to-tr from-primary-deep via-primary to-primary/40" />
      <div
        aria-hidden="true"
        className="relative z-10 -mt-11 ms-4 flex size-14 items-center justify-center rounded-xl bg-foreground text-background ring-4 ring-card [&_svg]:size-7"
      >
        <LightningIcon weight="fill" />
      </div>
      <CardHeader>
        <CardTitle>Command + R</CardTitle>
        <CardDescription>
          Your all-in-one shortcut for apps, automations, and devices.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-end">
        <Button size="lg" className="rounded-full px-4">
          Buy now
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const SkeletonCard: Story = {
  render: (args) => (
    <Card {...args} className="w-80" role="status" aria-busy="true" aria-label="Loading card">
      <CardCover>
        <Skeleton className="size-full rounded-none" />
      </CardCover>
      <CardHeader>
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="mt-1 h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </CardHeader>
      <CardFooter>
        <Skeleton className="h-3 w-1/4" />
      </CardFooter>
    </Card>
  ),
}
