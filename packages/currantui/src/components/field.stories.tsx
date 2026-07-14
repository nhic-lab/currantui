import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@nhic/currantui/components/field"
import { Checkbox } from "@nhic/currantui/components/checkbox"
import { Input } from "@nhic/currantui/components/input"
import { Switch } from "@nhic/currantui/components/switch"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/Field",
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          "Dependency-free form-field wrappers: label, description, and error wiring around any control. Grouped checkboxes/radios use FieldSet + FieldLegend.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "responsive"],
    },
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Field {...args} className="w-72">
      <FieldLabel htmlFor="field-facility">Facility name</FieldLabel>
      <Input id="field-facility" placeholder="Kigali Central" />
      <FieldDescription>
        The official name from the facility registry.
      </FieldDescription>
    </Field>
  ),
}

export const Invalid: Story = {
  render: (args) => (
    <Field {...args} data-invalid="true" className="w-72">
      <FieldLabel htmlFor="field-code">Facility code</FieldLabel>
      <Input id="field-code" aria-invalid defaultValue="XX-99" />
      <FieldError errors={[{ message: "Code must match the HF-#### format." }]} />
    </Field>
  ),
}

export const CheckboxGroup: Story = {
  render: () => (
    <FieldSet className="w-72">
      <FieldLegend variant="label">Report sections</FieldLegend>
      <FieldGroup className="gap-2">
        <Field orientation="horizontal">
          <Checkbox id="section-cases" defaultChecked />
          <FieldLabel htmlFor="section-cases">Case counts</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="section-stock" defaultChecked />
          <FieldLabel htmlFor="section-stock">Stock levels</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="section-staffing" />
          <FieldLabel htmlFor="section-staffing">Staffing</FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <Field orientation="horizontal" className="w-80">
      <FieldContent>
        <FieldLabel htmlFor="field-reminders">Submission reminders</FieldLabel>
        <FieldDescription>
          Notify the focal person before the weekly cut-off.
        </FieldDescription>
      </FieldContent>
      <Switch id="field-reminders" defaultChecked />
    </Field>
  ),
}
