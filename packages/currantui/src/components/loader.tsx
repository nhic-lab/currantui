import * as React from "react"

import { ProgressCircle } from "@nhic/currantui/components/progress-circle"
import { cn } from "@nhic/currantui/lib/utils"

/* Pixel sizes preserved from the original orbit spinner */
const LOADER_SIZES = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 60,
} as const

type LoaderSize = keyof typeof LOADER_SIZES

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: LoaderSize
  label?: string
}

/** @deprecated Use `ProgressCircle` from `@nhic/currantui/components/progress-circle` — removal planned for the next major. */
function Loader({
  size = "md",
  label = "Loading",
  className,
  style,
  ...props
}: LoaderProps) {
  return (
    <ProgressCircle
      aria-label={label}
      className={cn("text-foreground/65", className)}
      style={{
        width: LOADER_SIZES[size],
        height: LOADER_SIZES[size],
        ...style,
      }}
      {...props}
    />
  )
}

interface LoaderOverlayProps {
  label?: string
  className?: string
}

function LoaderOverlay({ label = "Loading", className }: LoaderOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80",
        className
      )}
    >
      <ProgressCircle aria-label={label} size="lg" />
    </div>
  )
}

export { Loader, LoaderOverlay }
