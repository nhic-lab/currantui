import * as React from "react"
import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
} from "react-aria-components"

import { CollectionCheckbox } from "@nhic/currantui/components/list-view"
import { cn } from "@nhic/currantui/lib/utils"
import type {
  GridListItemProps as AriaGridListItemProps,
  GridListProps as AriaGridListProps,
} from "react-aria-components"

/**
 * Card grid with list-view keyboard semantics: arrow keys move in two
 * dimensions, selection via `selectionMode`. Needs an accessible name via
 * `aria-label`; keep empty states inside `renderEmptyState`.
 */
function CardView<T extends object>({
  className,
  ...props
}: Omit<AriaGridListProps<T>, "className" | "layout"> & {
  className?: string
}) {
  return (
    <AriaGridList
      layout="grid"
      data-slot="card-view"
      className={cn(
        "grid w-full grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2 outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30 data-[empty]:block data-[empty]:py-6 data-[empty]:text-center data-[empty]:text-xs/relaxed data-[empty]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardViewItem({
  className,
  children,
  textValue,
  ...props
}: Omit<AriaGridListItemProps, "className" | "children"> & {
  className?: string
  children: React.ReactNode
}) {
  return (
    <AriaGridListItem
      data-slot="card-view-item"
      textValue={textValue}
      className={cn(
        "group/card-view-item relative flex flex-col overflow-hidden rounded-lg bg-card text-xs/relaxed text-card-foreground ring-1 ring-foreground/10 transition-shadow outline-none data-[hovered]:ring-foreground/25 data-[selected]:ring-2 data-[selected]:ring-primary data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {({ selectionMode, selectionBehavior }) => (
        <>
          {selectionMode !== "none" && selectionBehavior === "toggle" && (
            <CollectionCheckbox className="absolute top-2 end-2 z-10" />
          )}
          {children}
        </>
      )}
    </AriaGridListItem>
  )
}

export { CardView, CardViewItem }
