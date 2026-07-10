import { Tooltip } from "radix-ui"
import { Bell } from "@phosphor-icons/react"
import { cn } from "@nhic/currantui/lib/utils"

export function NotificationsButton({ className }: { className?: string }) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label="Notifications"
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
              "transition-colors",
              className,
            )}
          >
            <Bell size={16} aria-hidden />
          </button>
        </Tooltip.Trigger>
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
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
