import { UploadSimpleIcon } from "@phosphor-icons/react"

import { DropZone, FileTrigger } from "@nhic/currantui/components/drop-zone"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/DropZone",
  component: DropZone,
  parameters: {
    docs: {
      description: {
        component:
          "Drop target for files. The highlighted drop-target state appears while dragging over it; FileUploader composes this with a browse button and file list.",
      },
    },
  },
} satisfies Meta<typeof DropZone>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <DropZone aria-label="Upload report" className="w-80">
      <UploadSimpleIcon aria-hidden="true" className="size-5" />
      <span>Drag and drop the weekly report here</span>
    </DropZone>
  ),
}

export const WithFileTrigger: Story = {
  render: () => (
    <DropZone aria-label="Upload report" className="w-80">
      <UploadSimpleIcon aria-hidden="true" className="size-5" />
      <span>Drag and drop, or</span>
      <FileTrigger acceptedFileTypes={[".csv", ".xlsx"]} onSelect={() => {}}>
        Browse files
      </FileTrigger>
    </DropZone>
  ),
}

export const Disabled: Story = {
  render: () => (
    <DropZone aria-label="Upload report" isDisabled className="w-80">
      <UploadSimpleIcon aria-hidden="true" className="size-5" />
      <span>Uploads are closed for this reporting window</span>
    </DropZone>
  ),
}
