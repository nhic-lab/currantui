import * as React from "react"
import { Collapsible, Dialog as DialogPrimitive, Slot } from "radix-ui"

import { CaretDownIcon, XIcon } from "@phosphor-icons/react"
import { useShell } from "@nhic/currantui/components/shell"
import { cn } from "@nhic/currantui/lib/utils"

const sideNavRowClasses =
  "flex h-7 w-full items-center gap-2 rounded-md px-2 text-start text-sm/relaxed text-sidebar-foreground/70 transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/30 data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

function ShellSideNav({
  variant = "expandable",
  label = "Side navigation",
  className,
  children,
  ...props
}: React.ComponentProps<"nav"> & {
  variant?: "expandable" | "rail" | "fixed"
  label?: string
}) {
  const { openMobile, setOpenMobile, isMobile } = useShell()

  return (
    <>
      <nav
        id="shell-side-nav"
        aria-label={label}
        data-slot="shell-side-nav"
        data-variant={variant}
        className={cn(
          "group/side-nav sticky top-(--shell-header-h) col-start-1 row-start-2 z-30 h-[calc(100svh-var(--shell-header-h))] bg-sidebar text-sidebar-foreground",
          variant === "expandable" &&
            "w-(--shell-sidenav-w) overflow-hidden border-e border-sidebar-border transition-[width] duration-200 group-data-[state=collapsed]/shell:w-0 group-data-[state=collapsed]/shell:border-e-0 max-lg:hidden",
          variant === "fixed" &&
            "w-(--shell-sidenav-w) border-e border-sidebar-border",
          variant === "rail" && "w-(--shell-sidenav-w-rail)",
          className
        )}
        {...props}
      >
        <div
          data-slot="shell-side-nav-inner"
          className={cn(
            "flex h-full flex-col overflow-x-hidden overflow-y-auto py-2",
            variant === "rail"
              ? "absolute inset-y-0 start-0 w-(--shell-sidenav-w-rail) border-e border-sidebar-border bg-sidebar shadow-none transition-[width] duration-150 hover:w-(--shell-sidenav-w) hover:shadow-lg focus-within:w-(--shell-sidenav-w) focus-within:shadow-lg"
              : "w-(--shell-sidenav-w)"
          )}
        >
          {children}
        </div>
      </nav>
      {variant === "expandable" && (
        <DialogPrimitive.Root
          open={isMobile && openMobile}
          onOpenChange={setOpenMobile}
        >
          <DialogPrimitive.Overlay
            data-slot="shell-side-nav-overlay"
            className="fixed inset-0 z-50 bg-black/80 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
          />
          <DialogPrimitive.Content
            data-slot="shell-side-nav-mobile"
            aria-describedby={undefined}
            className="fixed inset-y-0 start-0 z-50 flex w-(--shell-sidenav-w) flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg outline-none duration-200 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-left-10 rtl:data-open:slide-in-from-right-10 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-left-10 rtl:data-closed:slide-out-to-right-10"
          >
            <DialogPrimitive.Title className="sr-only">
              {label}
            </DialogPrimitive.Title>
            <div className="flex h-(--shell-header-h) shrink-0 items-center justify-end border-b border-sidebar-border px-2">
              <DialogPrimitive.Close
                className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
                aria-label="Close navigation"
              >
                <XIcon className="size-4" />
              </DialogPrimitive.Close>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-2">
              {children}
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Root>
      )}
    </>
  )
}

function ShellSideNavItems({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="shell-side-nav-items"
      className={cn("flex min-h-0 flex-1 flex-col gap-0.5 px-2", className)}
      {...props}
    />
  )
}

function ShellSideNavLink({
  asChild = false,
  isActive = false,
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  isActive?: boolean
  icon?: React.ReactNode
}) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <li data-slot="shell-side-nav-item" className="flex">
      <Comp
        data-slot="shell-side-nav-link"
        data-active={isActive || undefined}
        aria-current={isActive ? "page" : undefined}
        className={cn(sideNavRowClasses, className)}
        {...props}
      >
        {icon && (
          <span
            aria-hidden="true"
            className="flex size-4 shrink-0 items-center justify-center"
          >
            {icon}
          </span>
        )}
        <span className="truncate">{children}</span>
      </Comp>
    </li>
  )
}

function ShellSideNavMenu({
  label,
  icon,
  defaultOpen,
  open,
  onOpenChange,
  className,
  children,
  ...props
}: React.ComponentProps<"li"> & {
  label: string
  icon?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <li data-slot="shell-side-nav-menu" className="flex flex-col" {...props}>
      <Collapsible.Root
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        className="flex flex-col gap-0.5"
      >
        <Collapsible.Trigger
          data-slot="shell-side-nav-menu-trigger"
          className={cn(
            sideNavRowClasses,
            "group/side-nav-menu [&_svg]:transition-transform",
            className
          )}
        >
          {icon && (
            <span
              aria-hidden="true"
              className="flex size-4 shrink-0 items-center justify-center"
            >
              {icon}
            </span>
          )}
          <span className="flex-1 truncate">{label}</span>
          <CaretDownIcon className="size-4! text-sidebar-foreground/50 group-data-open/side-nav-menu:rotate-180" />
        </Collapsible.Trigger>
        <Collapsible.Content data-slot="shell-side-nav-menu-content" asChild>
          <ul className="flex flex-col gap-0.5">{children}</ul>
        </Collapsible.Content>
      </Collapsible.Root>
    </li>
  )
}

function ShellSideNavMenuItem({
  asChild = false,
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean; isActive?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <li data-slot="shell-side-nav-menu-item" className="flex">
      <Comp
        data-slot="shell-side-nav-menu-link"
        data-active={isActive || undefined}
        aria-current={isActive ? "page" : undefined}
        className={cn(sideNavRowClasses, "ps-8", className)}
        {...props}
      />
    </li>
  )
}

function ShellSideNavDivider({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      aria-hidden="true"
      data-slot="shell-side-nav-divider"
      className={cn("mx-2 my-1 h-px shrink-0 bg-sidebar-border", className)}
      {...props}
    />
  )
}

function ShellSideNavFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="shell-side-nav-footer"
      className={cn(
        "mt-auto border-t border-sidebar-border px-2 pt-2",
        className
      )}
      {...props}
    />
  )
}

export {
  ShellSideNav,
  ShellSideNavItems,
  ShellSideNavLink,
  ShellSideNavMenu,
  ShellSideNavMenuItem,
  ShellSideNavDivider,
  ShellSideNavFooter,
}
