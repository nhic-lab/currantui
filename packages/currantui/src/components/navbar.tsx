import { cn } from "@nhic/currantui/lib/utils"
import type { ReactNode } from "react"

interface NavbarProps {
  leftSlot?: ReactNode
  rightSlot?: ReactNode
  className?: string
}

/** @deprecated Use `ShellHeader` from `@nhic/currantui/components/shell-header` — removal planned for the next major. */
export function Navbar({ leftSlot, rightSlot, className }: NavbarProps) {
  return (
    <header
      className={cn(
        "col-span-full flex items-center justify-between border-b border-sidebar-border bg-sidebar p-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">{leftSlot}</div>
      <div className="flex items-center gap-1">{rightSlot}</div>
    </header>
  )
}
