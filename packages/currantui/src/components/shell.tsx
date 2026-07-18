import * as React from "react"

import { useIsMobile } from "@nhic/currantui/hooks/use-mobile"
import { cn } from "@nhic/currantui/lib/utils"

const SHELL_COOKIE_NAME = "currantui_shell_sidenav"
const SHELL_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/* z-index ladder: content auto → side nav rail overlay z-30 → header + right
   panels z-40 → dialogs/sheets/popovers/tooltips z-50 → skip link z-60 */

type ShellContextValue = {
  /** Desktop side-nav expanded state (expandable variant) */
  open: boolean
  setOpen: (open: boolean) => void
  /** Mobile (max-lg) overlay open state */
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  /** Branches on isMobile; wired to ShellHeaderMenuButton and Mod+B */
  toggleSideNav: () => void
  /** Exclusive right-panel state — a single id keeps one panel open at a time */
  activePanel: string | null
  setActivePanel: React.Dispatch<React.SetStateAction<string | null>>
  togglePanel: (id: string) => void
}

const ShellContext = React.createContext<ShellContextValue | null>(null)

function useShell() {
  const context = React.useContext(ShellContext)
  if (!context) {
    throw new Error("useShell must be used within a ShellProvider.")
  }
  return context
}

function ShellProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  keyboardShortcut = true,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Uncontrolled initial state; SSR apps hydrate it from the SHELL_COOKIE_NAME cookie */
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Mod+B toggles the side nav */
  keyboardShortcut?: boolean
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next)
      onOpenChange?.(next)
      document.cookie = `${SHELL_COOKIE_NAME}=${next}; path=/; max-age=${SHELL_COOKIE_MAX_AGE}`
    },
    [openProp, onOpenChange]
  )

  const toggleSideNav = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev)
    } else {
      setOpen(!open)
    }
  }, [isMobile, open, setOpen])

  const [activePanel, setActivePanel] = React.useState<string | null>(null)
  const togglePanel = React.useCallback((id: string) => {
    setActivePanel((prev) => (prev === id ? null : id))
  }, [])

  React.useEffect(() => {
    if (!keyboardShortcut) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSideNav()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [keyboardShortcut, toggleSideNav])

  const contextValue = React.useMemo<ShellContextValue>(
    () => ({
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSideNav,
      activePanel,
      setActivePanel,
      togglePanel,
    }),
    [open, setOpen, openMobile, isMobile, toggleSideNav, activePanel, togglePanel]
  )

  return (
    <ShellContext.Provider value={contextValue}>
      <div
        data-slot="shell"
        data-state={open ? "expanded" : "collapsed"}
        style={
          {
            "--shell-header-h": "3rem",
            "--shell-sidenav-w": "16rem",
            "--shell-sidenav-w-rail": "3rem",
            "--shell-sidenav-w-rail-labeled": "4.5rem",
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "group/shell grid min-h-svh grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_1fr] bg-background",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ShellContext.Provider>
  )
}

function ShellContent({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      data-slot="shell-content"
      className={cn("col-start-2 row-start-2 min-w-0 outline-none", className)}
      {...props}
    />
  )
}

function ShellSkipToContent({
  href = "#main-content",
  children = "Skip to main content",
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      href={href}
      data-slot="shell-skip-to-content"
      className={cn(
        "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:start-2 focus-visible:top-2 focus-visible:z-60 focus-visible:flex focus-visible:h-7 focus-visible:items-center focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-2 focus-visible:text-sm/relaxed focus-visible:font-medium focus-visible:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export { ShellProvider, useShell, ShellContent, ShellSkipToContent, SHELL_COOKIE_NAME }
