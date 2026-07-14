import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@nhic/currantui/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn(
        "relative flex h-1.5 w-full items-center overflow-x-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full rounded-full bg-primary transition-all data-[state=indeterminate]:animate-pulse data-[state=indeterminate]:bg-primary/60"
        style={{ width: value != null ? `${value}%` : "100%" }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
