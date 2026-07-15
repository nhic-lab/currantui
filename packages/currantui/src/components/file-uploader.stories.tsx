import { FileUploader } from "@nhic/currantui/components/file-uploader"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/FileUploader",
  component: FileUploader,
  parameters: {
    docs: {
      description: {
        component:
          "Drop zone + browse button + file list. The component owns none of the transfer: the app uploads and reports state back through `items`.",
      },
    },
  },
  args: {
    hint: "CSV or Excel, up to 10 MB",
    acceptedFileTypes: [".csv", ".xlsx"],
    onSelect: () => {},
    onRemove: () => {},
  },
  render: (args) => (
    <div className="w-96">
      <FileUploader {...args} />
    </div>
  ),
} satisfies Meta<typeof FileUploader>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const WithFiles: Story = {
  args: {
    items: [
      {
        id: "1",
        name: "week-28-submissions.csv",
        size: 48_128,
        status: "complete",
      },
      {
        id: "2",
        name: "facility-registry-export.xlsx",
        size: 1_264_902,
        status: "uploading",
        progress: 62,
      },
      {
        id: "3",
        name: "stock-levels.csv",
        size: 92_412,
        status: "error",
        errorMessage: "Row 214 references a retired facility code.",
      },
    ],
  },
}

export const UploadingIndeterminate: Story = {
  args: {
    items: [
      {
        id: "1",
        name: "week-28-submissions.csv",
        size: 48_128,
        status: "uploading",
      },
    ],
  },
}
