import * as React from "react"

import { expect, userEvent, waitFor, within } from "storybook/test"

import { Tag, TagGroup } from "@nhic/currantui/components/tag-group"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/TagGroup",
  component: TagGroup,
  parameters: {
    docs: {
      description: {
        component:
          "Interactive tag collection — keyboard-navigable, removable, selectable. Badge stays the static status chip; FilterChip stays the filter-bar affordance.",
      },
    },
  },
} satisfies Meta<typeof TagGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TagGroup label="Districts">
      <Tag>Gasabo</Tag>
      <Tag>Kicukiro</Tag>
      <Tag>Nyarugenge</Tag>
      <Tag>Musanze</Tag>
    </TagGroup>
  ),
}

function RemovableDemo() {
  const [sections, setSections] = React.useState([
    { id: "cases", label: "Case counts" },
    { id: "stock", label: "Stock levels" },
    { id: "staffing", label: "Staffing" },
  ])

  return (
    <TagGroup
      label="Report sections"
      items={sections}
      renderEmptyState={() => (
        <span className="text-xs/relaxed text-muted-foreground">
          All sections removed.
        </span>
      )}
      onRemove={(keys) =>
        setSections((prev) => prev.filter((section) => !keys.has(section.id)))
      }
    >
      {(section: { id: string; label: string }) => (
        <Tag id={section.id}>{section.label}</Tag>
      )}
    </TagGroup>
  )
}

export const Removable: Story = {
  render: () => <RemovableDemo />,
  parameters: {
    docs: {
      source: {
        code: `function ReportSections() {
  const [sections, setSections] = React.useState([
    { id: "cases", label: "Case counts" },
    { id: "stock", label: "Stock levels" },
    { id: "staffing", label: "Staffing" },
  ])

  return (
    <TagGroup
      label="Report sections"
      items={sections}
      renderEmptyState={() => (
        <span className="text-xs/relaxed text-muted-foreground">
          All sections removed.
        </span>
      )}
      onRemove={(keys) =>
        setSections((prev) => prev.filter((section) => !keys.has(section.id)))
      }
    >
      {(section: { id: string; label: string }) => (
        <Tag id={section.id}>{section.label}</Tag>
      )}
    </TagGroup>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("row", { name: /stock levels/i })).toBeVisible()

    await userEvent.click(
      canvas.getByRole("button", { name: /remove stock levels/i })
    )
    await waitFor(() =>
      expect(
        canvas.queryByRole("row", { name: /stock levels/i })
      ).not.toBeInTheDocument()
    )
  },
}

export const SingleSelection: Story = {
  render: () => (
    <TagGroup
      label="Severity"
      selectionMode="single"
      defaultSelectedKeys={["moderate"]}
    >
      <Tag id="low">Low</Tag>
      <Tag id="moderate">Moderate</Tag>
      <Tag id="high">High</Tag>
    </TagGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const high = canvas.getByRole("row", { name: "High" })
    await userEvent.click(high)
    await waitFor(() =>
      expect(high).toHaveAttribute("aria-selected", "true")
    )
  },
}

export const MultipleSelection: Story = {
  render: () => (
    <TagGroup
      label="Modalities"
      selectionMode="multiple"
      defaultSelectedKeys={["xray", "ct"]}
    >
      <Tag id="xray">X-ray</Tag>
      <Tag id="ct">CT</Tag>
      <Tag id="mri">MRI</Tag>
      <Tag id="ultrasound">Ultrasound</Tag>
    </TagGroup>
  ),
}

export const WithDisabledTag: Story = {
  render: () => (
    <TagGroup label="Export formats" selectionMode="single">
      <Tag id="csv">CSV</Tag>
      <Tag id="xlsx">Excel</Tag>
      <Tag id="pdf" isDisabled>
        PDF
      </Tag>
    </TagGroup>
  ),
}
