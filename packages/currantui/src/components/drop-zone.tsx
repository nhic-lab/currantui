import * as React from "react"
import {
  Button as AriaButton,
  DropZone as AriaDropZone,
  FileTrigger as AriaFileTrigger,
} from "react-aria-components"

import { buttonVariants } from "@nhic/currantui/components/button"
import { cn } from "@nhic/currantui/lib/utils"
import type {
  DropZoneProps as AriaDropZoneProps,
  FileTriggerProps as AriaFileTriggerProps,
} from "react-aria-components"

/**
 * Drop target for files (and drag data). Pair with FileTrigger for
 * click-to-browse; FileUploader composes both with a file list. Give it an
 * accessible name via `aria-label`.
 */
function DropZone({
  className,
  ...props
}: Omit<AriaDropZoneProps, "className"> & { className?: string }) {
  return (
    <AriaDropZone
      data-slot="drop-zone"
      className={cn(
        "flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-input/10 p-4 text-center text-xs/relaxed text-muted-foreground transition-colors outline-none data-[drop-target]:border-primary data-[drop-target]:bg-primary/5 data-[drop-target]:text-foreground data-[focus-visible]:border-ring data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30 data-[disabled]:pointer-events-none data-[disabled]:border-border/50 data-[disabled]:bg-transparent data-[disabled]:[&_button]:opacity-50",
        className
      )}
      {...props}
    />
  )
}

/**
 * Click-to-browse file selection rendered as an outline button; `children`
 * is the button label. Accepts `acceptedFileTypes`, `allowsMultiple`, and
 * `onSelect(fileList)`.
 */
function FileTrigger({
  children,
  className,
  ...props
}: AriaFileTriggerProps & { className?: string; children?: React.ReactNode }) {
  return (
    <AriaFileTrigger {...props}>
      <AriaButton
        data-slot="file-trigger-button"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          className
        )}
      >
        {children}
      </AriaButton>
    </AriaFileTrigger>
  )
}

export { DropZone, FileTrigger }
