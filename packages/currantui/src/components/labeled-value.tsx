import * as React from "react"

import { cn } from "@nhic/currantui/lib/utils"

function LabeledValue({
  label,
  orientation = "vertical",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  label: React.ReactNode
  orientation?: "vertical" | "horizontal"
}) {
  return (
    <div
      data-slot="labeled-value"
      data-orientation={orientation}
      className={cn(
        "flex",
        orientation === "horizontal"
          ? "flex-row items-baseline gap-1.5"
          : "flex-col gap-0.5",
        className
      )}
      {...props}
    >
      <span
        data-slot="labeled-value-label"
        className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
      >
        {label}
      </span>
      <span
        data-slot="labeled-value-value"
        className="text-sm/relaxed text-foreground tabular-nums"
      >
        {children}
      </span>
    </div>
  )
}

export { LabeledValue }
