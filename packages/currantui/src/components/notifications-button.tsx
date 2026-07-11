import * as React from "react"
import { Popover, Tooltip } from "radix-ui"
import { Bell } from "@phosphor-icons/react"
import { useState } from "react"
import { cn } from "@nhic/currantui/lib/utils"
import type { ReactNode } from "react"

interface NotificationsButtonProps {
  /** Unread count shown as a badge on the bell; hidden when 0/undefined */
  count?: number
  /** Panel content — compose with NotificationList / NotificationItem */
  children?: ReactNode
  className?: string
}

export function NotificationsButton({
  count,
  children,
  className,
}: NotificationsButtonProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const label =
    count && count > 0 ? `Notifications, ${count} unread` : "Notifications"

  const trigger = (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "relative flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "aria-expanded:bg-sidebar-accent aria-expanded:text-sidebar-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        "transition-colors",
        className,
      )}
    >
      <Bell size={16} aria-hidden />
      {count && count > 0 ? (
        <span
          aria-hidden
          className="absolute end-1 top-1 flex h-3 min-w-3 items-center justify-center rounded-full bg-primary px-0.5 text-[0.5rem] font-bold tabular-nums text-primary-foreground"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  )

  /* Without panel content, keep the original tooltip-only bell */
  if (children == null) {
    return (
      <Tooltip.Provider delayDuration={300}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>{trigger}</Tooltip.Trigger>
          <NotificationsTooltip />
        </Tooltip.Root>
      </Tooltip.Provider>
    )
  }

  return (
    <Tooltip.Provider delayDuration={300}>
      {/* Fully controlled so the tooltip never flips controlled↔uncontrolled; suppressed while the panel is open. */}
      <Tooltip.Root
        open={tooltipOpen && !popoverOpen}
        onOpenChange={setTooltipOpen}
      >
        <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
          <Tooltip.Trigger asChild>
            <Popover.Trigger asChild>{trigger}</Popover.Trigger>
          </Tooltip.Trigger>

          <Popover.Portal>
            <Popover.Content
              align="end"
              sideOffset={6}
              aria-label="Notifications"
              className="z-50 w-80 rounded-lg border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
            >
              <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
                <p className="text-xs font-medium">Notifications</p>
                {count && count > 0 ? (
                  <span className="text-[0.625rem] text-muted-foreground tabular-nums">
                    {count} unread
                  </span>
                ) : null}
              </div>
              {children}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        <NotificationsTooltip />
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

function NotificationsTooltip() {
  return (
    <Tooltip.Portal>
      <Tooltip.Content
        side="bottom"
        sideOffset={8}
        className="z-50 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
      >
        Notifications
        <Tooltip.Arrow className="fill-popover" />
      </Tooltip.Content>
    </Tooltip.Portal>
  )
}

export function NotificationList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="notification-list"
      className={cn(
        "flex max-h-80 list-none flex-col overflow-y-auto p-1",
        className,
      )}
      {...props}
    />
  )
}

interface NotificationItemProps
  extends Omit<React.ComponentProps<"button">, "title"> {
  title: ReactNode
  description?: ReactNode
  /** Preformatted timestamp text, e.g. "5m ago" — no date logic here */
  time?: ReactNode
  unread?: boolean
  /** Leading slot, e.g. a Phosphor icon */
  icon?: ReactNode
}

export function NotificationItem({
  title,
  description,
  time,
  unread = false,
  icon,
  className,
  ...props
}: NotificationItemProps) {
  return (
    <li data-slot="notification-item">
      <button
        type="button"
        data-unread={unread || undefined}
        className={cn(
          "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-start transition-colors outline-none",
          "hover:bg-muted focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
          className,
        )}
        {...props}
      >
        {icon ? (
          <span
            aria-hidden
            className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5"
          >
            {icon}
          </span>
        ) : null}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-baseline justify-between gap-2">
            <span
              className={cn(
                "truncate text-xs/relaxed",
                unread ? "font-semibold" : "font-medium",
              )}
            >
              {title}
            </span>
            {time ? (
              <span className="shrink-0 text-[0.625rem] text-muted-foreground tabular-nums">
                {time}
              </span>
            ) : null}
          </span>
          {description ? (
            <span className="line-clamp-2 text-xs/relaxed text-muted-foreground">
              {description}
            </span>
          ) : null}
        </span>
        {unread ? (
          <span
            aria-hidden
            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
          />
        ) : null}
      </button>
    </li>
  )
}
