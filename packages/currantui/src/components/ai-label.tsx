import * as React from "react"

import { SparkleIcon } from "@phosphor-icons/react"
import {
  Toggletip,
  ToggletipBody,
  ToggletipContent,
  ToggletipTitle,
  ToggletipTrigger,
} from "@nhic/currantui/components/toggletip"
import { Badge } from "@nhic/currantui/components/badge"
import { cn } from "@nhic/currantui/lib/utils"
import type { badgeVariants } from "@nhic/currantui/components/badge";
import type { VariantProps } from "class-variance-authority"

/**
 * Badge marking AI-generated or AI-assisted content; clicking it opens a
 * toggletip whose body — the provenance explanation, model, limitations —
 * is fully caller-supplied. Never render it without that explanation.
 */
function AiLabel({
  label = "AI",
  variant = "secondary",
  title,
  triggerLabel = "About this AI-generated content",
  side = "top",
  align = "start",
  children,
  className,
  ...props
}: React.ComponentProps<typeof Toggletip> &
  VariantProps<typeof badgeVariants> & {
    /** Badge text next to the sparkle */
    label?: React.ReactNode
    title?: React.ReactNode
    /** Accessible name for the badge trigger */
    triggerLabel?: string
    side?: React.ComponentProps<typeof ToggletipContent>["side"]
    align?: React.ComponentProps<typeof ToggletipContent>["align"]
    /** Extra classes for the badge */
    className?: string
  }) {
  return (
    <Toggletip {...props}>
      <ToggletipTrigger asChild>
        <Badge asChild variant={variant}>
          <button
            type="button"
            data-slot="ai-label"
            aria-label={triggerLabel}
            className={cn("cursor-pointer", className)}
          >
            <SparkleIcon weight="fill" data-icon="inline-start" />
            {label}
          </button>
        </Badge>
      </ToggletipTrigger>
      <ToggletipContent
        data-slot="ai-label-content"
        aria-label={triggerLabel}
        side={side}
        align={align}
      >
        {title && <ToggletipTitle>{title}</ToggletipTitle>}
        <ToggletipBody>{children}</ToggletipBody>
      </ToggletipContent>
    </Toggletip>
  )
}

export { AiLabel }
