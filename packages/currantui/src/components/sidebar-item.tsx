import { Tooltip } from "radix-ui"
import type { ReactElement } from "react"

interface SidebarItemProps {
  label: string
  children: ReactElement
}

export function SidebarItem({ label, children }: SidebarItemProps) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            sideOffset={8}
            className="z-50 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
          >
            {label}
            <Tooltip.Arrow className="fill-popover" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
