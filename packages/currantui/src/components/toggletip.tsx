import * as React from "react"

import { InfoIcon } from "@phosphor-icons/react"
import { Button } from "@nhic/currantui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nhic/currantui/components/popover"
import { cn } from "@nhic/currantui/lib/utils"

/**
 * Click-triggered information bubble: unlike Tooltip (hover-only, plain
 * text) it works on touch, can hold links and rich content, and stays open
 * until dismissed. For a labelled help preset, use ContextualHelp.
 */
function Toggletip(props: React.ComponentProps<typeof Popover>) {
  return <Popover {...props} />
}

/** Ghost icon button trigger (info icon by default); `asChild` swaps in a custom trigger element. */
function ToggletipTrigger({
  asChild = false,
  children,
  "aria-label": ariaLabel = "More information",
  ...props
}: React.ComponentProps<typeof Button>) {
  if (asChild) {
    return (
      <PopoverTrigger data-slot="toggletip-trigger" asChild>
        {children}
      </PopoverTrigger>
    )
  }

  return (
    <PopoverTrigger data-slot="toggletip-trigger" asChild>
      <Button variant="ghost" size="icon-xs" aria-label={ariaLabel} {...props}>
        {children ?? <InfoIcon />}
      </Button>
    </PopoverTrigger>
  )
}

function ToggletipContent({
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  return (
    <PopoverContent
      data-slot="toggletip-content"
      className={cn("w-64 gap-2", className)}
      {...props}
    />
  )
}

function ToggletipTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toggletip-title"
      className={cn("font-heading text-xs font-semibold", className)}
      {...props}
    />
  )
}

function ToggletipBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toggletip-body"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Toggletip,
  ToggletipTrigger,
  ToggletipContent,
  ToggletipTitle,
  ToggletipBody,
}
