import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@nhic/currantui/lib/utils"
import type { VariantProps } from "class-variance-authority"

const meterTrackVariants = cva(
  "relative flex h-1.5 w-full items-center overflow-x-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary/20",
        success: "bg-success/20",
        warning: "bg-warning/20",
        info: "bg-info/20",
        destructive: "bg-destructive/20",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const meterIndicatorVariants = cva("h-full rounded-full transition-all", {
  variants: {
    variant: {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      info: "bg-info",
      destructive: "bg-destructive",
    },
  },
  defaultVariants: { variant: "default" },
})

/**
 * Static measurement within a known range (storage used, capacity, score) —
 * use Progress for the advancement of a running task. Requires an accessible
 * name via `aria-label` or `aria-labelledby`.
 */
function Meter({
  value,
  min = 0,
  max = 100,
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof meterIndicatorVariants> & {
    value: number
    min?: number
    max?: number
  }) {
  const clamped = Math.min(max, Math.max(min, value))
  const percent = max === min ? 0 : ((clamped - min) / (max - min)) * 100

  return (
    <div
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={min}
      aria-valuemax={max}
      data-slot="meter"
      data-variant={variant}
      className={cn(meterTrackVariants({ variant }), className)}
      {...props}
    >
      <div
        data-slot="meter-indicator"
        className={meterIndicatorVariants({ variant })}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export { Meter }
