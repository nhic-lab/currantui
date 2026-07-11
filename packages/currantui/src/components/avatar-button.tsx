import { DropdownMenu, Tooltip } from "radix-ui"
import { Gear, SignOut, UserCircle } from "@phosphor-icons/react"
import { useState } from "react"
import { cn } from "@nhic/currantui/lib/utils"

interface AvatarButtonProps {
  name?: string
  email?: string
  onSettings?: () => void
  onSignOut?: () => void
  className?: string
}

export function AvatarButton({ name, email, onSettings, onSignOut, className }: AvatarButtonProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <Tooltip.Provider delayDuration={300}>
      {/* Fully controlled so the tooltip never flips controlled↔uncontrolled; suppressed while the menu is open. */}
      <Tooltip.Root open={tooltipOpen && !dropdownOpen} onOpenChange={setTooltipOpen}>
        <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
              >
                <UserCircle size={18} aria-hidden />
              </button>
            </DropdownMenu.Trigger>
          </Tooltip.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={6}
              className="z-50 min-w-40 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
            >
              {(name || email) && (
                <>
                  <div className="px-2 py-1.5">
                    {name && <p className="truncate text-xs font-medium">{name}</p>}
                    {email && <p className="truncate text-[11px] text-muted-foreground">{email}</p>}
                  </div>
                  <DropdownMenu.Separator className="my-1 h-px bg-border" />
                </>
              )}

              <DropdownMenu.Item
                onSelect={onSettings}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs outline-none select-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground"
              >
                <Gear size={14} aria-hidden />
                Settings
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="my-1 h-px bg-border" />

              <DropdownMenu.Item
                onSelect={onSignOut}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs text-destructive outline-none select-none hover:bg-destructive/10 focus:bg-destructive/10"
              >
                <SignOut size={14} aria-hidden />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            sideOffset={8}
            className="z-50 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
          >
            Account
            <Tooltip.Arrow className="fill-popover" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
