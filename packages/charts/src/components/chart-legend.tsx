import * as React from "react"

import { cn } from "@nhic/currantui/lib/utils"

export interface ChartLegendItem {
  label: string
  /** Any CSS color; series usually pass a `var(--chart-N)` reference */
  color: string
}

function ChartLegend({
  items,
  className,
  ...props
}: React.ComponentProps<"ul"> & { items: Array<ChartLegendItem> }) {
  return (
    <ul
      data-slot="chart-legend"
      className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}
      {...props}
    >
      {items.map((item) => (
        <li
          key={item.label}
          data-slot="chart-legend-item"
          className="flex items-center gap-1.5 text-xs/relaxed text-muted-foreground"
        >
          <span
            aria-hidden="true"
            data-slot="chart-legend-swatch"
            className="size-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

export { ChartLegend }
