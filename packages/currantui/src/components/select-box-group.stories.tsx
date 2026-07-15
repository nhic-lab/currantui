import {
  BuildingsIcon,
  FirstAidIcon,
  HospitalIcon,
  PulseIcon,
  SyringeIcon,
  VirusIcon,
} from "@phosphor-icons/react"
import { expect, userEvent, within } from "storybook/test"

import {
  SelectBoxGroup,
  SelectBoxGroupItem,
  SelectBoxGroupItemDescription,
  SelectBoxGroupItemTitle,
} from "@nhic/currantui/components/select-box-group"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/SelectBoxGroup",
  component: SelectBoxGroup,
  parameters: {
    docs: {
      description: {
        component:
          "Selectable cards for choices that carry a title, description, or icon — richer than a radio or checkbox row. `type=\"single\"` keeps radio semantics, `type=\"multiple\"` checkbox semantics.",
      },
    },
  },
  args: {
    "aria-label": "Facility type",
  },
} satisfies Meta<typeof SelectBoxGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  render: () => (
    <SelectBoxGroup
      aria-label="Facility type"
      defaultValue="hospital"
      className="w-lg sm:grid-cols-3"
    >
      <SelectBoxGroupItem value="hospital">
        <SelectBoxGroupItemTitle>
          <HospitalIcon />
          Hospital
        </SelectBoxGroupItemTitle>
        <SelectBoxGroupItemDescription>
          Referral or district hospital
        </SelectBoxGroupItemDescription>
      </SelectBoxGroupItem>
      <SelectBoxGroupItem value="health-center">
        <SelectBoxGroupItemTitle>
          <FirstAidIcon />
          Health center
        </SelectBoxGroupItemTitle>
        <SelectBoxGroupItemDescription>
          Primary care and maternity
        </SelectBoxGroupItemDescription>
      </SelectBoxGroupItem>
      <SelectBoxGroupItem value="health-post">
        <SelectBoxGroupItemTitle>
          <BuildingsIcon />
          Health post
        </SelectBoxGroupItemTitle>
        <SelectBoxGroupItemDescription>
          Community-level services
        </SelectBoxGroupItemDescription>
      </SelectBoxGroupItem>
    </SelectBoxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole("radio", { name: /hospital/i })
    ).toHaveAttribute("aria-checked", "true")

    await userEvent.click(canvas.getByRole("radio", { name: /health center/i }))
    await expect(
      canvas.getByRole("radio", { name: /health center/i })
    ).toHaveAttribute("aria-checked", "true")
    await expect(
      canvas.getByRole("radio", { name: /hospital/i })
    ).toHaveAttribute("aria-checked", "false")
  },
}

export const Multiple: Story = {
  render: () => (
    <SelectBoxGroup
      aria-label="Surveillance programs"
      type="multiple"
      defaultValue={["malaria"]}
      className="w-lg sm:grid-cols-3"
    >
      <SelectBoxGroupItem value="malaria">
        <SelectBoxGroupItemTitle>
          <VirusIcon />
          Malaria
        </SelectBoxGroupItemTitle>
        <SelectBoxGroupItemDescription>
          Weekly confirmed cases
        </SelectBoxGroupItemDescription>
      </SelectBoxGroupItem>
      <SelectBoxGroupItem value="immunization">
        <SelectBoxGroupItemTitle>
          <SyringeIcon />
          Immunization
        </SelectBoxGroupItemTitle>
        <SelectBoxGroupItemDescription>
          Coverage by antigen
        </SelectBoxGroupItemDescription>
      </SelectBoxGroupItem>
      <SelectBoxGroupItem value="ncd">
        <SelectBoxGroupItemTitle>
          <PulseIcon />
          NCD screening
        </SelectBoxGroupItemTitle>
        <SelectBoxGroupItemDescription>
          Hypertension and diabetes
        </SelectBoxGroupItemDescription>
      </SelectBoxGroupItem>
    </SelectBoxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole("checkbox", { name: /immunization/i })
    )
    await expect(
      canvas.getByRole("checkbox", { name: /immunization/i })
    ).toHaveAttribute("aria-checked", "true")
    await expect(
      canvas.getByRole("checkbox", { name: /malaria/i })
    ).toHaveAttribute("aria-checked", "true")

    await userEvent.click(canvas.getByRole("checkbox", { name: /malaria/i }))
    await expect(
      canvas.getByRole("checkbox", { name: /malaria/i })
    ).toHaveAttribute("aria-checked", "false")
  },
}

export const WithDisabledOption: Story = {
  render: () => (
    <SelectBoxGroup
      aria-label="Facility type"
      defaultValue="hospital"
      className="w-lg sm:grid-cols-3"
    >
      <SelectBoxGroupItem value="hospital">
        <SelectBoxGroupItemTitle>
          <HospitalIcon />
          Hospital
        </SelectBoxGroupItemTitle>
      </SelectBoxGroupItem>
      <SelectBoxGroupItem value="health-center">
        <SelectBoxGroupItemTitle>
          <FirstAidIcon />
          Health center
        </SelectBoxGroupItemTitle>
      </SelectBoxGroupItem>
      <SelectBoxGroupItem value="health-post" disabled>
        <SelectBoxGroupItemTitle>
          <BuildingsIcon />
          Health post
        </SelectBoxGroupItemTitle>
      </SelectBoxGroupItem>
    </SelectBoxGroup>
  ),
}
