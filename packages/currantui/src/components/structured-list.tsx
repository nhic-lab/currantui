import * as React from "react"

import { cn } from "@nhic/currantui/lib/utils"

/**
 * Lightweight read-only rows for reference content (definitions, specs,
 * plain records). For sortable/selectable data grids, use the Table family
 * or the rich-table recipe instead.
 */
function StructuredList({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "contained" }) {
  return (
    <div
      role="table"
      data-slot="structured-list"
      data-variant={variant}
      className={cn(
        "group/structured-list w-full text-sm/relaxed",
        variant === "contained" && "overflow-hidden rounded-lg border",
        className
      )}
      {...props}
    />
  )
}

function StructuredListHead({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="rowgroup"
      data-slot="structured-list-head"
      className={cn(
        "group-data-[variant=contained]/structured-list:bg-muted/50",
        className
      )}
      {...props}
    />
  )
}

function StructuredListBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="rowgroup"
      data-slot="structured-list-body"
      className={cn(
        "group-data-[variant=contained]/structured-list:*:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function StructuredListRow({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="row"
      data-slot="structured-list-row"
      className={cn("flex border-b", className)}
      {...props}
    />
  )
}

function StructuredListCell({
  head = false,
  className,
  ...props
}: React.ComponentProps<"div"> & { head?: boolean }) {
  return (
    <div
      role={head ? "columnheader" : "cell"}
      data-slot="structured-list-cell"
      className={cn(
        "min-w-0 flex-1 px-3 py-2",
        head && "font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  StructuredList,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
}
