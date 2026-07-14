import { Field, FieldLabel } from "@nhic/currantui/components/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@nhic/currantui/components/radio-group"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Forms/RadioGroup",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="weekly" aria-label="Reporting frequency">
      <Field orientation="horizontal">
        <RadioGroupItem value="weekly" id="freq-weekly" />
        <FieldLabel htmlFor="freq-weekly">Weekly</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="monthly" id="freq-monthly" />
        <FieldLabel htmlFor="freq-monthly">Monthly</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="quarterly" id="freq-quarterly" />
        <FieldLabel htmlFor="freq-quarterly">Quarterly</FieldLabel>
      </Field>
    </RadioGroup>
  ),
}

export const WithDisabledOption: Story = {
  render: () => (
    <RadioGroup defaultValue="csv" aria-label="Export format">
      <Field orientation="horizontal">
        <RadioGroupItem value="csv" id="fmt-csv" />
        <FieldLabel htmlFor="fmt-csv">CSV</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="xlsx" id="fmt-xlsx" />
        <FieldLabel htmlFor="fmt-xlsx">Excel</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="pdf" id="fmt-pdf" disabled />
        <FieldLabel htmlFor="fmt-pdf">PDF (coming soon)</FieldLabel>
      </Field>
    </RadioGroup>
  ),
}

export const Invalid: Story = {
  render: () => (
    <RadioGroup aria-label="Consent" aria-invalid>
      <Field orientation="horizontal">
        <RadioGroupItem value="yes" id="consent-yes" aria-invalid />
        <FieldLabel htmlFor="consent-yes">Yes</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="no" id="consent-no" aria-invalid />
        <FieldLabel htmlFor="consent-no">No</FieldLabel>
      </Field>
    </RadioGroup>
  ),
}
