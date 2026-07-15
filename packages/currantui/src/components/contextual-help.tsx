import * as React from "react"

import { InfoIcon, QuestionIcon } from "@phosphor-icons/react"
import {
  Toggletip,
  ToggletipBody,
  ToggletipContent,
  ToggletipTitle,
  ToggletipTrigger,
} from "@nhic/currantui/components/toggletip"
import { cn } from "@nhic/currantui/lib/utils"

/**
 * Toggletip preset for explaining a nearby field or heading: an info or
 * question icon that opens a titled help bubble. Place it right after the
 * label it explains.
 */
function ContextualHelp({
  icon = "info",
  title,
  children,
  side = "top",
  align = "start",
  triggerLabel,
  className,
  ...props
}: React.ComponentProps<typeof Toggletip> & {
  icon?: "info" | "question"
  title?: React.ReactNode
  /** Accessible name for the trigger button; defaults per icon */
  triggerLabel?: string
  side?: React.ComponentProps<typeof ToggletipContent>["side"]
  align?: React.ComponentProps<typeof ToggletipContent>["align"]
  /** Extra classes for the bubble */
  className?: string
}) {
  const Icon = icon === "question" ? QuestionIcon : InfoIcon
  const label =
    triggerLabel ?? (icon === "question" ? "Help" : "More information")

  return (
    <Toggletip {...props}>
      <ToggletipTrigger aria-label={label}>
        <Icon />
      </ToggletipTrigger>
      <ToggletipContent
        data-slot="contextual-help-content"
        aria-label={label}
        side={side}
        align={align}
        className={cn(className)}
      >
        {title && <ToggletipTitle>{title}</ToggletipTitle>}
        <ToggletipBody>{children}</ToggletipBody>
      </ToggletipContent>
    </Toggletip>
  )
}

export { ContextualHelp }
