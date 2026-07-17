import * as React from "react"

import { cn } from "@nhic/currantui/lib/utils"

export interface ChartLegendItem {
  label: string
  /** Any CSS color; series usually pass a `var(--chart-N)` reference */
  color: string
}

/**
 * HTML series legend. With `onToggleItem` the items become toggle buttons
 * that show or hide their series; hidden items stay listed but dimmed.
 */
function ChartLegend({
  items,
  hiddenLabels,
  onToggleItem,
  className,
  ...props
}: React.ComponentProps<"ul"> & {
  items: Array<ChartLegendItem>
  hiddenLabels?: ReadonlySet<string>
  onToggleItem?: (label: string) => void
}) {
  return (
    <ul
      data-slot="chart-legend"
      className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}
      {...props}
    >
      {items.map((item) => {
        const hidden = hiddenLabels?.has(item.label) ?? false
        const swatch = (
          <span
            aria-hidden="true"
            data-slot="chart-legend-swatch"
            className={cn("size-2.5 shrink-0 rounded-sm", hidden && "opacity-30")}
            style={{ backgroundColor: item.color }}
          />
        )
        return (
          <li key={item.label} data-slot="chart-legend-item">
            {onToggleItem ? (
              <button
                type="button"
                aria-pressed={!hidden}
                onClick={() => onToggleItem(item.label)}
                className={cn(
                  "flex items-center gap-1.5 rounded-sm text-sm/relaxed text-muted-foreground outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
                  hidden && "text-muted-foreground/60 line-through"
                )}
              >
                {swatch}
                {item.label}
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-sm/relaxed text-muted-foreground">
                {swatch}
                {item.label}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export { ChartLegend }
