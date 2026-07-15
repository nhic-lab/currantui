import * as React from "react"

import {
  CheckCircleIcon,
  FileIcon,
  UploadSimpleIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react"
import { ProgressCircle } from "@nhic/currantui/components/progress-circle"
import { DropZone, FileTrigger } from "@nhic/currantui/components/drop-zone"
import { Button } from "@nhic/currantui/components/button"
import { Progress } from "@nhic/currantui/components/progress"
import { cn } from "@nhic/currantui/lib/utils"

interface FileUploaderItem {
  id: string
  name: string
  /** Bytes; rendered human-readable when provided */
  size?: number
  status: "uploading" | "complete" | "error"
  /** 0–100, shown while uploading */
  progress?: number
  errorMessage?: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB"]
  let value = bytes
  let unit = ""
  for (const next of units) {
    value /= 1024
    unit = next
    if (value < 1024) break
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${unit}`
}

function FileUploaderRow({
  item,
  onRemove,
}: {
  item: FileUploaderItem
  onRemove?: (id: string) => void
}) {
  return (
    <li
      data-slot="file-uploader-item"
      data-status={item.status}
      className={cn(
        "flex items-center gap-2 rounded-md border border-border px-2 py-1.5",
        item.status === "error" && "border-destructive/40"
      )}
    >
      <FileIcon
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-xs/relaxed font-medium">
            {item.name}
          </span>
          {item.size != null && (
            <span className="shrink-0 text-[0.625rem] text-muted-foreground tabular-nums">
              {formatBytes(item.size)}
            </span>
          )}
        </div>
        {item.status === "uploading" && (
          <Progress
            aria-label={`Uploading ${item.name}`}
            value={item.progress ?? null}
            className="h-1"
          />
        )}
        {item.status === "error" && item.errorMessage != null && (
          <span className="text-[0.625rem] text-destructive">
            {item.errorMessage}
          </span>
        )}
      </div>
      {item.status === "uploading" && (
        <ProgressCircle
          aria-hidden="true"
          size="sm"
          className="size-3.5 shrink-0"
        />
      )}
      {item.status === "complete" && (
        <CheckCircleIcon
          weight="fill"
          aria-hidden="true"
          className="size-4 shrink-0 text-success"
        />
      )}
      {item.status === "error" && (
        <XCircleIcon
          weight="fill"
          aria-hidden="true"
          className="size-4 shrink-0 text-destructive"
        />
      )}
      {onRemove && (
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Remove ${item.name}`}
          onClick={() => onRemove(item.id)}
        >
          <XIcon />
        </Button>
      )}
    </li>
  )
}

/**
 * Drop zone + browse button + file list. Purely presentational about
 * transfer: the app owns the network and reports state back through `items`.
 */
function FileUploader({
  items = [],
  onSelect,
  onRemove,
  acceptedFileTypes,
  allowsMultiple = true,
  label = "Drag and drop files here",
  triggerLabel = "Browse files",
  hint,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect"> & {
  items?: Array<FileUploaderItem>
  /** Receives files from both drag-and-drop and the browse button */
  onSelect?: (files: Array<File>) => void
  onRemove?: (id: string) => void
  acceptedFileTypes?: Array<string>
  allowsMultiple?: boolean
  label?: React.ReactNode
  triggerLabel?: React.ReactNode
  hint?: React.ReactNode
}) {
  return (
    <div
      data-slot="file-uploader"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      <DropZone
        aria-label={typeof label === "string" ? label : "File drop zone"}
        getDropOperation={(types) =>
          acceptedFileTypes == null ||
          acceptedFileTypes.some((type) => types.has(type))
            ? "copy"
            : "cancel"
        }
        onDrop={(event) => {
          const fileItems = event.items.filter(
            (item) => item.kind === "file"
          )
          void Promise.all(fileItems.map((item) => item.getFile())).then(
            (files) => {
              if (files.length > 0) {
                onSelect?.(allowsMultiple ? files : files.slice(0, 1))
              }
            }
          )
        }}
      >
        <UploadSimpleIcon aria-hidden="true" className="size-5" />
        <span>{label}</span>
        <FileTrigger
          acceptedFileTypes={acceptedFileTypes}
          allowsMultiple={allowsMultiple}
          onSelect={(fileList) => {
            if (fileList && fileList.length > 0) {
              onSelect?.(Array.from(fileList))
            }
          }}
        >
          {triggerLabel}
        </FileTrigger>
        {hint != null && (
          <span className="text-[0.625rem] text-muted-foreground">{hint}</span>
        )}
      </DropZone>
      {items.length > 0 && (
        <ul
          data-slot="file-uploader-list"
          className="flex flex-col gap-1.5"
          aria-label="Selected files"
        >
          {items.map((item) => (
            <FileUploaderRow key={item.id} item={item} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </div>
  )
}

export { FileUploader }
export type { FileUploaderItem }
