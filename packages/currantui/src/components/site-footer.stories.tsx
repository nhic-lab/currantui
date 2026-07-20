import { SiteFooter } from "@nhic/currantui/components/site-footer"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/SiteFooter",
  component: SiteFooter,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SiteFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    brandHref: "/",
    brandAria: "NHIC home",
    /* Page-relative: the deployed Storybook lives under a subpath */
    logoSrc: "./logo.svg",
    copyright: "© 2026 National Health Intelligence Center",
    columns: [
      {
        title: "Products",
        links: [
          { label: "Overview", href: "/products" },
          { label: "Docs", href: "/docs" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Design standards", href: "/standards" },
          { label: "Release notes", href: "/releases" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ],
      },
    ],
  },
  parameters: {
    docs: {
      source: {
        code: `<SiteFooter
  brandHref="/"
  brandAria="NHIC home"
  copyright="© 2026 National Health Intelligence Center"
  columns={[
    {
      title: "Products",
      links: [
        { label: "Overview", href: "/products" },
        { label: "Docs", href: "/docs" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Design standards", href: "/standards" },
        { label: "Release notes", href: "/releases" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ]}
/>`,
        language: "tsx",
      },
    },
  },
}
