import { ErrorPage } from "@nhic/currantui/components/error-page"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/ErrorPage",
  component: ErrorPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ErrorPage>

export default meta
type Story = StoryObj<typeof meta>

export const NotFound: Story = {
  args: {
    code: 404,
    headline: "That's an error.",
    detail: "The requested URL was not found on this server.",
  },
}

export const ServerError: Story = {
  args: {
    code: 500,
    headline: "That's an error.",
    detail: "The server encountered an error and could not complete your request.",
  },
}
