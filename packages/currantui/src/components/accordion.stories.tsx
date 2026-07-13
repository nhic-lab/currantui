import { userEvent, within } from "storybook/test"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@nhic/currantui/components/accordion"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  args: {
    type: "single",
  },
  argTypes: {
    type: { table: { disable: true } },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

const items = (
  <>
    <AccordionItem value="completeness">
      <AccordionTrigger>How is completeness calculated?</AccordionTrigger>
      <AccordionContent>
        Completeness is the share of expected data elements that carry a value
        in the submitted report, weighted by facility type.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="deadline">
      <AccordionTrigger>When are weekly reports due?</AccordionTrigger>
      <AccordionContent>
        Reports are due Thursday 18:00 local time; late entries require
        district approval before they count toward coverage.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="revisions">
      <AccordionTrigger>Can a submitted report be revised?</AccordionTrigger>
      <AccordionContent>
        Yes — revisions are open until the weekly cut-off and are tracked in
        the audit log.
      </AccordionContent>
    </AccordionItem>
  </>
)

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      {items}
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "When are weekly reports due?" })
    )
    await canvas.findByText(/due Thursday 18:00 local time/)
  },
}

export const Multiple: Story = {
  render: () => (
    <Accordion
      type="multiple"
      defaultValue={["completeness", "deadline"]}
      className="w-96"
    >
      {items}
    </Accordion>
  ),
}
