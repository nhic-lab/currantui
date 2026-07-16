import * as React from "react"

import { cn } from "@nhic/currantui/lib/utils"

/**
 * Continuous-scale legend: a sequential gradient bar between the formatted
 * domain extremes. Pure CSS (color-mix over the chart-2 token), so it follows
 * theme changes without re-rendering any canvas.
 */
function ChartRampLegend({
  label,
  minLabel,
  maxLabel,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Name of the measure the ramp encodes */
  label?: string
  minLabel: string
  maxLabel: string
}) {
  return (
    <div
      data-slot="chart-ramp-legend"
      className={cn(
        "flex items-center gap-2 text-xs/relaxed text-muted-foreground",
        className
      )}
      {...props}
    >
      {label && <span data-slot="chart-ramp-label">{label}</span>}
      <span className="tabular-nums">{minLabel}</span>
      <span
        aria-hidden="true"
        data-slot="chart-ramp-swatch"
        className="h-2.5 w-28 rounded-sm"
        style={{
          background:
            "linear-gradient(to right, color-mix(in oklab, var(--chart-2) 12%, transparent), var(--chart-2))",
        }}
      />
      <span className="tabular-nums">{maxLabel}</span>
    </div>
  )
}

export { ChartRampLegend }
