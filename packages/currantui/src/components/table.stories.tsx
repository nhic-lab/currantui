import { Badge } from "@nhic/currantui/components/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@nhic/currantui/components/table"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/Table",
  component: Table,
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const studies = [
  { id: "ST-1042", modality: "CT", facility: "Kigali Central", status: "Reported" },
  { id: "ST-1043", modality: "X-ray", facility: "Butare District", status: "Pending" },
  { id: "ST-1044", modality: "MRI", facility: "Kigali Central", status: "Reported" },
  { id: "ST-1045", modality: "Ultrasound", facility: "Musanze", status: "In review" },
]

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Recent imaging studies.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Study</TableHead>
          <TableHead>Modality</TableHead>
          <TableHead>Facility</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {studies.map((study) => (
          <TableRow key={study.id}>
            <TableCell className="font-medium tabular-nums">
              {study.id}
            </TableCell>
            <TableCell>{study.modality}</TableCell>
            <TableCell>{study.facility}</TableCell>
            <TableCell>
              <Badge
                variant={study.status === "Reported" ? "secondary" : "outline"}
              >
                {study.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="tabular-nums">{studies.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}
