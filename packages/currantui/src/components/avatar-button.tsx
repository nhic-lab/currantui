import * as React from "react"
import { DropdownMenu, Tooltip } from "radix-ui"
import { UserCircle } from "@phosphor-icons/react"
import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@nhic/currantui/components/avatar"
import { cn } from "@nhic/currantui/lib/utils"

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function AvatarButton({ children }: { children: React.ReactNode }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <Tooltip.Provider delayDuration={300}>
      {/* Fully controlled so the tooltip never flips controlled↔uncontrolled; suppressed while the menu is open. */}
      <Tooltip.Root
        open={tooltipOpen && !dropdownOpen}
        onOpenChange={setTooltipOpen}
      >
        <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
          {children}
        </DropdownMenu.Root>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

function AvatarButtonTrigger({
  name,
  src,
  tooltip = "Account",
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  name?: string
  src?: string
  tooltip?: string
}) {
  const trimmedName = name?.trim()

  return (
    <>
      <Tooltip.Trigger asChild>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            aria-label="User menu"
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
              "transition-colors",
              className,
            )}
            {...props}
          >
            {src || trimmedName ? (
              <Avatar size="sm">
                {src && <AvatarImage src={src} alt="" />}
                <AvatarFallback>
                  {trimmedName ? (
                    initials(trimmedName)
                  ) : (
                    <UserCircle size={14} aria-hidden />
                  )}
                </AvatarFallback>
              </Avatar>
            ) : (
              <UserCircle size={18} aria-hidden />
            )}
          </button>
        </DropdownMenu.Trigger>
      </Tooltip.Trigger>

      <Tooltip.Portal>
        <Tooltip.Content
          side="bottom"
          sideOffset={8}
          className="z-50 rounded-md bg-popover px-2 py-1 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
        >
          {tooltip}
          <Tooltip.Arrow className="fill-popover" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </>
  )
}

function AvatarButtonMenu({
  className,
  align = "end",
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Content>) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-40 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          className,
        )}
        {...props}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  )
}

function AvatarButtonLabel({
  name,
  email,
  className,
}: {
  name?: string
  email?: string
  className?: string
}) {
  if (!name && !email) return null
  return (
    <div className={cn("px-2 py-1.5", className)}>
      {name && <p className="truncate text-sm font-medium">{name}</p>}
      {email && <p className="truncate text-xs text-muted-foreground">{email}</p>}
    </div>
  )
}

function AvatarButtonItem({
  icon: Icon,
  destructive,
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Item> & {
  icon?: React.ElementType
  destructive?: boolean
}) {
  return (
    <DropdownMenu.Item
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none",
        destructive
          ? "text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground",
        className,
      )}
      {...props}
    >
      {Icon && <Icon size={16} aria-hidden />}
      {children}
    </DropdownMenu.Item>
  )
}

function AvatarButtonSeparator({ className }: { className?: string }) {
  return <DropdownMenu.Separator className={cn("my-1 h-px bg-border", className)} />
}

export {
  AvatarButton,
  AvatarButtonTrigger,
  AvatarButtonMenu,
  AvatarButtonLabel,
  AvatarButtonItem,
  AvatarButtonSeparator,
}
