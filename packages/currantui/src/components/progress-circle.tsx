import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@nhic/currantui/lib/utils"
import type { VariantProps } from "class-variance-authority"

const progressCircleVariants = cva("relative shrink-0 text-primary", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-6",
      lg: "size-10",
    },
  },
  defaultVariants: { size: "default" },
})

const RADIUS = 13
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * Circular progress: a determinate ring for known completion, or an
 * indeterminate spinner when `value` is nullish. Color follows
 * `currentColor` (brand primary by default). Requires an accessible name
 * via `aria-label` unless rendered decorative with `aria-hidden`.
 */
function ProgressCircle({
  value,
  minValue = 0,
  maxValue = 100,
  size = "default",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof progressCircleVariants> & {
    value?: number | null
    minValue?: number
    maxValue?: number
  }) {
  const indeterminate = value == null
  const clamped = indeterminate
    ? 0
    : Math.min(maxValue, Math.max(minValue, value))
  const fraction = indeterminate
    ? 0.25
    : maxValue === minValue
      ? 0
      : (clamped - minValue) / (maxValue - minValue)

  return (
    <div
      role="progressbar"
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      aria-valuenow={indeterminate ? undefined : clamped}
      data-slot="progress-circle"
      data-state={indeterminate ? "indeterminate" : "determinate"}
      className={cn(progressCircleVariants({ size }), className)}
      {...props}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className={cn(
          "size-full -rotate-90",
          indeterminate && "animate-orbit-spin"
        )}
      >
        <circle
          cx="16"
          cy="16"
          r={RADIUS}
          strokeWidth="3"
          className="stroke-current opacity-25"
        />
        <circle
          cx="16"
          cy="16"
          r={RADIUS}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
          className="stroke-current transition-[stroke-dashoffset]"
        />
      </svg>
    </div>
  )
}

export { ProgressCircle, progressCircleVariants }
