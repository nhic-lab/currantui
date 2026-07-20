import { ErrorPage } from "@nhic/currantui/components/error-page"
import { HicLogo } from "@nhic/currantui/components/hic-logo"

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
    /* Page-relative: the deployed Storybook lives under a subpath */
    logo: <HicLogo className="[&_img]:h-7" src="./logo.svg" />,
  },
  parameters: {
    docs: {
      source: {
        code: `<ErrorPage
  code={404}
  headline="That's an error."
  detail="The requested URL was not found on this server."
/>`,
        language: "tsx",
      },
    },
  },
}

export const ServerError: Story = {
  args: {
    code: 500,
    headline: "That's an error.",
    detail: "The server encountered an error and could not complete your request.",
    logo: <HicLogo className="[&_img]:h-7" src="./logo.svg" />,
  },
  parameters: {
    docs: {
      source: {
        code: `<ErrorPage
  code={500}
  headline="That's an error."
  detail="The server encountered an error and could not complete your request."
/>`,
        language: "tsx",
      },
    },
  },
}
