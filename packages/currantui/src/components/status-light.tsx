import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@nhic/currantui/lib/utils"
import type { VariantProps } from "class-variance-authority"

const statusLightDotVariants = cva("size-2 shrink-0 rounded-full", {
  variants: {
    variant: {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      info: "bg-info",
      destructive: "bg-destructive",
      muted: "bg-muted-foreground",
    },
  },
  defaultVariants: { variant: "default" },
})

/**
 * Colored dot + label for a state that isn't a count or an alert
 * (published, available, offline…). The meaning must come from the label,
 * never the color alone.
 */
function StatusLight({
  variant = "default",
  className,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof statusLightDotVariants>) {
  return (
    <span
      data-slot="status-light"
      data-variant={variant}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs/relaxed text-foreground",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="status-light-dot"
        className={statusLightDotVariants({ variant })}
      />
      {children}
    </span>
  )
}

export { StatusLight, statusLightDotVariants }
