import * as React from "react"
import { Collapsible } from "radix-ui"

import { CaretDownIcon } from "@phosphor-icons/react"
import { cn } from "@nhic/currantui/lib/utils"

function Inspector({
  header,
  className,
  children,
  ...props
}: React.ComponentProps<"aside"> & { header?: React.ReactNode }) {
  return (
    <aside
      data-slot="inspector"
      className={cn(
        "flex w-72 flex-col rounded-lg bg-card text-sm/relaxed text-card-foreground ring-1 ring-foreground/10",
        className
      )}
      {...props}
    >
      {header && (
        <div
          data-slot="inspector-header"
          className="border-b border-border/50 px-3 py-2 font-heading text-sm font-semibold"
        >
          {header}
        </div>
      )}
      <div data-slot="inspector-body" className="min-h-0 flex-1 overflow-y-auto p-1">
        {children}
      </div>
    </aside>
  )
}

function InspectorSection({
  title,
  defaultOpen,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children?: React.ReactNode
}) {
  return (
    <Collapsible.Root defaultOpen={defaultOpen} data-slot="inspector-section">
      <Collapsible.Trigger className="group/inspector-section flex h-8 w-full items-center gap-1 rounded-md px-2 text-start font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring [&_svg]:shrink-0">
        <CaretDownIcon
          aria-hidden="true"
          className="size-3.5 -rotate-90 text-muted-foreground transition-transform group-data-open/inspector-section:rotate-0"
        />
        {title}
      </Collapsible.Trigger>
      <Collapsible.Content className="flex flex-col gap-2 px-2 py-2">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

function InspectorRow({
  label,
  children,
}: {
  label: string
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="inspector-row"
      className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-2"
    >
      <span className="truncate text-xs text-muted-foreground">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function InspectorSeparator() {
  return (
    <div
      aria-hidden="true"
      data-slot="inspector-separator"
      className="mx-2 my-1 h-px bg-border/50"
    />
  )
}

export { Inspector, InspectorRow, InspectorSection, InspectorSeparator }
