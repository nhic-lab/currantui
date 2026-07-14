import * as React from "react"
import { Slot } from "radix-ui"

import { CaretDownIcon, ListIcon, XIcon } from "@phosphor-icons/react"
import { useShell } from "@nhic/currantui/components/shell"
import { cn } from "@nhic/currantui/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nhic/currantui/components/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@nhic/currantui/components/tooltip"

const headerNavLinkClasses =
  "flex h-8 items-center gap-1 rounded-md px-2 text-xs/relaxed text-sidebar-foreground/70 transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/30 data-active:font-medium data-active:text-sidebar-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"

const globalActionClasses =
  "relative flex size-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

function ShellHeader({ className, ...props }: React.ComponentProps<"header">) {
  const ref = React.useRef<HTMLElement>(null)

  /* The header grows with its content (tall brand lockups, wrapped nav) —
     write the measured height back to --shell-header-h so the side nav and
     panels stay offset correctly. min-h keeps this loop-free: raising the
     variable never changes the measured content height. */
  React.useEffect(() => {
    const el = ref.current
    const shell = el?.closest<HTMLElement>('[data-slot="shell"]')
    if (!el || !shell) return
    const sync = () =>
      shell.style.setProperty("--shell-header-h", `${el.offsetHeight}px`)
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => {
      observer.disconnect()
      shell.style.removeProperty("--shell-header-h")
    }
  }, [])

  return (
    <header
      ref={ref}
      data-slot="shell-header"
      className={cn(
        "sticky top-0 z-40 col-span-full row-start-1 flex min-h-(--shell-header-h) items-center gap-1 border-b border-sidebar-border bg-sidebar px-2 py-1.5 text-sidebar-foreground",
        className
      )}
      {...props}
    />
  )
}

function ShellHeaderMenuButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { open, openMobile, isMobile, toggleSideNav } = useShell()
  const expanded = isMobile ? openMobile : open

  return (
    <button
      type="button"
      data-slot="shell-header-menu-button"
      aria-label={expanded ? "Close navigation" : "Open navigation"}
      aria-expanded={expanded}
      aria-controls="shell-side-nav"
      onClick={toggleSideNav}
      className={cn(globalActionClasses, className)}
      {...props}
    >
      {expanded ? <XIcon /> : <ListIcon />}
    </button>
  )
}

/**
 * Brand slot of the header. Children can be plain text, `HicLogo`, or any
 * custom lockup — descendant images/SVGs are clamped to the header height.
 */
function ShellHeaderName({
  asChild = false,
  className,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="shell-header-name"
      className={cn(
        "flex items-center gap-2 rounded-md px-1 font-heading text-sm font-semibold tracking-tight whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring/30 [&_img]:max-h-8 [&_img]:w-auto [&_svg:not([class*='size-'])]:max-h-8",
        className
      )}
      {...props}
    />
  )
}

function ShellHeaderNav({
  className,
  children,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Primary"
      data-slot="shell-header-nav"
      // -my-1.5 cancels the header's py-1.5 so the nav spans border to
      // border and the active bar can sit exactly on the header's bottom edge
      className={cn("-my-1.5 ms-2 self-stretch max-lg:hidden", className)}
      {...props}
    >
      <ul className="flex h-full items-stretch gap-0.5">{children}</ul>
    </nav>
  )
}

function ShellHeaderNavLink({
  asChild = false,
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean; isActive?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <li data-slot="shell-header-nav-item" className="relative flex">
      <Comp
        data-slot="shell-header-nav-link"
        data-active={isActive || undefined}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          headerNavLinkClasses,
          "h-full data-active:after:absolute data-active:after:inset-x-2 data-active:after:bottom-0 data-active:after:h-0.5 data-active:after:bg-sidebar-primary",
          className
        )}
        {...props}
      />
    </li>
  )
}

function ShellHeaderNavMenu({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"li"> & { label: string }) {
  return (
    <li data-slot="shell-header-nav-menu" className="flex" {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            headerNavLinkClasses,
            "h-full aria-expanded:bg-sidebar-accent aria-expanded:text-sidebar-accent-foreground [&_svg]:transition-transform aria-expanded:[&_svg]:rotate-180",
            className
          )}
        >
          {label}
          <CaretDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">{children}</DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

function ShellHeaderNavMenuItem({
  asChild = false,
  isActive = false,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem> & { isActive?: boolean }) {
  return (
    <DropdownMenuItem
      asChild={asChild}
      data-slot="shell-header-nav-menu-item"
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </DropdownMenuItem>
  )
}

function ShellGlobalBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="shell-global-bar"
      className={cn("ms-auto flex items-center gap-1", className)}
      {...props}
    />
  )
}

function ShellGlobalAction({
  label,
  panelId,
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  /** Accessible name, also shown as the tooltip */
  label: string
  /** Wires the action to a ShellPanel with the same id (toggle + aria-expanded) */
  panelId?: string
}) {
  const { activePanel, togglePanel } = useShell()
  const active = panelId !== undefined && activePanel === panelId

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-slot="shell-global-action"
            data-active={active || undefined}
            data-shell-panel-trigger={panelId}
            aria-label={label}
            aria-expanded={panelId !== undefined ? active : undefined}
            aria-controls={
              panelId !== undefined ? `shell-panel-${panelId}` : undefined
            }
            onClick={(event) => {
              onClick?.(event)
              if (panelId !== undefined && !event.defaultPrevented) {
                togglePanel(panelId)
              }
            }}
            className={cn(globalActionClasses, className)}
            {...props}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export {
  ShellHeader,
  ShellHeaderMenuButton,
  ShellHeaderName,
  ShellHeaderNav,
  ShellHeaderNavLink,
  ShellHeaderNavMenu,
  ShellHeaderNavMenuItem,
  ShellGlobalBar,
  ShellGlobalAction,
}
