import * as React from "react"
import { Dialog as DialogPrimitive, Slot } from "radix-ui"

import { useShell } from "@nhic/currantui/components/shell"
import { cn } from "@nhic/currantui/lib/utils"

function ShellPanel({
  id,
  label,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Content>, "id"> & {
  /** Pairs the panel with the ShellGlobalAction carrying the same panelId */
  id: string
  /** Accessible name of the panel dialog */
  label: string
}) {
  const { activePanel, setActivePanel } = useShell()

  return (
    <DialogPrimitive.Root
      open={activePanel === id}
      onOpenChange={(next) => {
        // A close event only clears the state this panel still owns —
        // otherwise panel A's deferred dismiss clobbers a just-opened panel B
        setActivePanel((prev) => (next ? id : prev === id ? null : prev))
      }}
      modal={false}
    >
      <DialogPrimitive.Content
        id={`shell-panel-${id}`}
        data-slot="shell-panel"
        aria-describedby={undefined}
        onInteractOutside={(event) => {
          // Let the owning trigger's own click handle the toggle, otherwise
          // dismiss-then-reopen makes the trigger a no-op
          const target = event.target as Element | null
          if (target?.closest(`[data-shell-panel-trigger="${id}"]`)) {
            event.preventDefault()
          }
        }}
        className={cn(
          "fixed top-(--shell-header-h) bottom-0 z-40 flex w-(--shell-sidenav-w) flex-col overflow-y-auto border-s border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg outline-none inset-e-0 duration-200 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-right-10 rtl:data-open:slide-in-from-left-10 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-right-10 rtl:data-closed:slide-out-to-left-10",
          className
        )}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">
          {label}
        </DialogPrimitive.Title>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  )
}

function ShellSwitcher({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="shell-switcher"
      className={cn("flex flex-col gap-0.5 p-2", className)}
      {...props}
    />
  )
}

function ShellSwitcherItem({
  asChild = false,
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean; isActive?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <li data-slot="shell-switcher-item" className="flex">
      <Comp
        data-slot="shell-switcher-link"
        data-active={isActive || undefined}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex h-7 w-full items-center gap-2 rounded-md px-2 text-sm/relaxed text-sidebar-foreground/70 transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/30 data-active:font-medium data-active:text-sidebar-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        {...props}
      />
    </li>
  )
}

function ShellSwitcherDivider({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      aria-hidden="true"
      data-slot="shell-switcher-divider"
      className={cn("mx-2 my-1 h-px bg-sidebar-border", className)}
      {...props}
    />
  )
}

export { ShellPanel, ShellSwitcher, ShellSwitcherItem, ShellSwitcherDivider }
