import { expect, userEvent, within } from "storybook/test"

import {
  CodeSnippet,
  CodeSnippetInline,
} from "@nhic/currantui/components/code-snippet"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/CodeSnippet",
  component: CodeSnippet,
  parameters: {
    docs: {
      description: {
        component:
          "Monochrome code block with a copy button, plus an inline pill for identifiers in prose. No syntax highlighting — that stays an app concern.",
      },
    },
  },
  args: {
    children: "pnpm add @nhic/currantui",
  },
} satisfies Meta<typeof CodeSnippet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Multiline: Story = {
  args: {
    children: `import { Button } from "@nhic/currantui/components/button"

export function SubmitRow() {
  return <Button type="submit">Submit report</Button>
}`,
  },
  render: (args) => (
    <div className="w-md">
      <CodeSnippet {...args} />
    </div>
  ),
}

export const Expandable: Story = {
  args: {
    expandable: true,
    children: [
      `{`,
      `  "facility": "hf-0042",`,
      `  "district": "Gasabo",`,
      `  "period": "2026-W28",`,
      `  "indicators": {`,
      `    "opd_visits": 412,`,
      `    "referrals": 18,`,
      `    "stockouts": 0,`,
      `    "vaccinations": 133,`,
      `    "deliveries": 9,`,
      `    "malaria_confirmed": 57`,
      `  },`,
      `  "submitted_by": "m.uwase",`,
      `  "submitted_at": "2026-07-13T09:12:00Z"`,
      `}`,
    ].join("\n"),
  },
  render: (args) => (
    <div className="w-md">
      <CodeSnippet {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole("button", { name: "Show more" })

    await expect(toggle).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(toggle)
    await expect(
      canvas.getByRole("button", { name: "Show less" })
    ).toHaveAttribute("aria-expanded", "true")
  },
}

export const WithoutCopy: Story = {
  args: {
    hideCopy: true,
  },
}

export const Inline: Story = {
  render: () => (
    <p className="max-w-sm text-xs/relaxed text-foreground">
      Install with <CodeSnippetInline>pnpm add @nhic/currantui</CodeSnippetInline>{" "}
      and import the stylesheet once via{" "}
      <CodeSnippetInline>@import "@nhic/currantui/globals.css"</CodeSnippetInline>.
    </p>
  ),
}
