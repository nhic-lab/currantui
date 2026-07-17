import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { cn } from "@nhic/currantui/lib/utils"

/**
 * Single-select control styled like the tabs list — one option is always
 * active (clicking the active option never deselects it). Use Tabs instead
 * when the options switch visible panels.
 */
function SegmentedControl({
  className,
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: Omit<
  React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const value = valueProp ?? internal

  return (
    <ToggleGroupPrimitive.Root
      type="single"
      data-slot="segmented-control"
      value={value}
      onValueChange={(next) => {
        if (!next) return
        setInternal(next)
        onValueChange?.(next)
      }}
      className={cn(
        "inline-flex h-8 w-fit items-center justify-center rounded-lg bg-muted p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function SegmentedControlItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="segmented-control-item"
      className={cn(
        "inline-flex h-full flex-1 items-center justify-center gap-1 rounded-md border border-transparent px-2 text-sm/relaxed font-medium whitespace-nowrap text-foreground/70 transition-all outline-none hover:text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

export { SegmentedControl, SegmentedControlItem }
