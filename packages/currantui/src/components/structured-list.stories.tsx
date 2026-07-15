import {
  StructuredList,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
} from "@nhic/currantui/components/structured-list"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/StructuredList",
  component: StructuredList,
  parameters: {
    docs: {
      description: {
        component:
          "Lightweight read-only rows for reference content — definitions, specs, plain records. For sortable or selectable data grids, use the Table family or the rich-table recipe.",
      },
    },
  },
  args: {
    "aria-label": "Reporting cadences",
  },
  argTypes: {
    variant: { control: "select", options: ["default", "contained"] },
  },
} satisfies Meta<typeof StructuredList>

export default meta
type Story = StoryObj<typeof meta>

const CADENCES = [
  {
    name: "Weekly surveillance",
    due: "Mondays, 12:00",
    scope: "Notifiable diseases and stockouts",
  },
  {
    name: "Monthly service report",
    due: "5th of the month",
    scope: "OPD visits, referrals, vaccinations",
  },
  {
    name: "Quarterly quality review",
    due: "15 days after quarter end",
    scope: "Completeness and timeliness scores",
  },
]

/* Element constant (not a component) so docs snippets expand the rows */
const cadenceRows = (
  <>
    <StructuredListHead>
      <StructuredListRow>
        <StructuredListCell head>Report</StructuredListCell>
        <StructuredListCell head>Due</StructuredListCell>
        <StructuredListCell head>Scope</StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {CADENCES.map((cadence) => (
        <StructuredListRow key={cadence.name}>
          <StructuredListCell>{cadence.name}</StructuredListCell>
          <StructuredListCell>{cadence.due}</StructuredListCell>
          <StructuredListCell className="text-muted-foreground">
            {cadence.scope}
          </StructuredListCell>
        </StructuredListRow>
      ))}
    </StructuredListBody>
  </>
)

export const Default: Story = {
  render: (args) => (
    <div className="w-2xl">
      <StructuredList {...args}>
        {cadenceRows}
      </StructuredList>
    </div>
  ),
}

export const Contained: Story = {
  args: {
    variant: "contained",
  },
  render: (args) => (
    <div className="w-2xl">
      <StructuredList {...args}>
        {cadenceRows}
      </StructuredList>
    </div>
  ),
}

export const WithoutHeader: Story = {
  args: {
    "aria-label": "Facility details",
    variant: "contained",
  },
  render: (args) => (
    <div className="w-md">
      <StructuredList {...args}>
        <StructuredListBody>
          {[
            ["Facility", "Gasabo District Hospital"],
            ["Level", "District hospital"],
            ["Catchment", "530,000 residents"],
          ].map(([label, detail]) => (
            <StructuredListRow key={label}>
              <StructuredListCell className="max-w-36 font-medium text-foreground">
                {label}
              </StructuredListCell>
              <StructuredListCell>{detail}</StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredList>
    </div>
  ),
}
