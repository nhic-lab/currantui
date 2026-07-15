import * as React from "react"

import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { ProgressCircle } from "@nhic/currantui/components/progress-circle"
import { cn } from "@nhic/currantui/lib/utils"

/**
 * Spinner-plus-text feedback for a short inline operation (saving a row,
 * submitting a form). Announces itself as a live region: `status` for
 * loading/success, `alert` for error. For progress without text, use
 * ProgressCircle directly.
 */
function InlineLoading({
  status = "loading",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  status?: "loading" | "success" | "error"
}) {
  return (
    <div
      role={status === "error" ? "alert" : "status"}
      data-slot="inline-loading"
      data-status={status}
      className={cn(
        "inline-flex items-center gap-2 text-xs/relaxed text-foreground",
        className
      )}
      {...props}
    >
      {status === "loading" && (
        <ProgressCircle size="sm" aria-hidden="true" />
      )}
      {status === "success" && (
        <CheckCircleIcon
          weight="fill"
          aria-hidden="true"
          className="size-4 shrink-0 text-success"
        />
      )}
      {status === "error" && (
        <WarningCircleIcon
          weight="fill"
          aria-hidden="true"
          className="size-4 shrink-0 text-destructive"
        />
      )}
      {children}
    </div>
  )
}

export { InlineLoading }
