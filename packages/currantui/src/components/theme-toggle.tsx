import { Tooltip } from "radix-ui"
import { Moon, Sun } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { cn } from "../lib/utils"

const STORAGE_KEY = "currantui-theme"

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light" | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setTheme(stored === "light" ? "light" : "dark")
  }, [])

  function toggle() {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.classList.toggle("dark", next === "dark")
    document.documentElement.style.colorScheme = next
  }

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            onClick={toggle}
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
              "transition-colors",
              className,
            )}
          >
            {theme === "light" ? (
              <Moon size={16} aria-hidden />
            ) : (
              <Sun size={16} aria-hidden />
            )}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            sideOffset={8}
            className="z-50 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
            <Tooltip.Arrow className="fill-popover" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
