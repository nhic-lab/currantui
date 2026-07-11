import { userEvent, within } from "storybook/test"

import { AvatarButton } from "@nhic/currantui/components/avatar-button"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/AvatarButton",
  component: AvatarButton,
  args: {
    name: "A. Uwase",
    email: "analyst@example.org",
  },
} satisfies Meta<typeof AvatarButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Open: Story = {
  parameters: {
    a11y: {
      config: {
        // Radix DropdownMenu marks the page background aria-hidden while
        // open, which axe flags because the focusable trigger sits inside
        // it (library-level interplay, not story authoring)
        rules: [{ id: "aria-hidden-focus", enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "User menu" }))
    // Menu renders in a portal outside the canvas root
    await within(document.body).findByRole("menuitem", { name: /Sign out/ })
  },
}
