import { FileTextIcon, UserPlusIcon, WarningIcon } from "@phosphor-icons/react"
import { userEvent, within } from "storybook/test"

import {
  NotificationItem,
  NotificationList,
  NotificationsButton,
} from "@nhic/currantui/components/notifications-button"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/NotificationsButton",
  component: NotificationsButton,
  // Sidebar badge: the panel/list API is new in 0.3.0
  tags: ["new"],
} satisfies Meta<typeof NotificationsButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const panel = (
  <NotificationList>
    <NotificationItem
      unread
      icon={<FileTextIcon />}
      title="Report ready"
      description="The radiology summary for ST-1042 finished rendering."
      time="5m ago"
    />
    <NotificationItem
      unread
      icon={<UserPlusIcon />}
      title="New reviewer added"
      description="A. Uwase joined the Kigali Central review pool."
      time="1h ago"
    />
    <NotificationItem
      icon={<WarningIcon />}
      title="Sync delayed"
      description="Butare District has not synced in 12 hours."
      time="Yesterday"
    />
  </NotificationList>
)

export const WithNotifications: Story = {
  args: {
    count: 2,
    children: panel,
  },
}

export const Open: Story = {
  args: {
    count: 2,
    children: panel,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Notifications, 2 unread" })
    )
    // Panel renders in a portal outside the canvas root
    await within(document.body).findByText("Report ready")
  },
}
