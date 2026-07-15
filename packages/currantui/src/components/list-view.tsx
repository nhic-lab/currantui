import * as React from "react"
import {
  Checkbox as AriaCheckbox,
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
} from "react-aria-components"

import { CheckIcon, MinusIcon } from "@phosphor-icons/react"
import { checkboxBoxClasses } from "@nhic/currantui/components/checkbox"
import { cn } from "@nhic/currantui/lib/utils"
import type {
  GridListItemProps as AriaGridListItemProps,
  GridListProps as AriaGridListProps,
} from "react-aria-components"

/* Selection box for collection rows — mirrors the Checkbox visuals via the
   shared box recipe (the selection slot can't host the form control) */
function CollectionCheckbox({ className }: { className?: string }) {
  return (
    <AriaCheckbox
      slot="selection"
      data-slot="collection-checkbox"
      className={cn("shrink-0 outline-none", className)}
    >
      {({ isSelected, isIndeterminate, isFocusVisible }) => (
        <span
          className={cn(
            checkboxBoxClasses,
            isFocusVisible && "border-ring ring-2 ring-ring/30",
            // dark: the box recipe's translucent fill wins over bg-primary,
            // so the tick goes primary to match the border instead
            (isSelected || isIndeterminate) &&
              "border-primary bg-primary text-primary-foreground dark:bg-transparent dark:text-primary"
          )}
        >
          {isIndeterminate ? (
            <MinusIcon aria-hidden="true" className="size-3.5" />
          ) : isSelected ? (
            <CheckIcon aria-hidden="true" className="size-3.5" />
          ) : null}
        </span>
      )}
    </AriaCheckbox>
  )
}

/**
 * Keyboard-navigable row collection with optional single/multiple selection
 * (`selectionMode`). Needs an accessible name via `aria-label`; keep empty
 * states inside `renderEmptyState`. For tabular data use the table family.
 */
function ListView<T extends object>({
  className,
  ...props
}: Omit<AriaGridListProps<T>, "className"> & { className?: string }) {
  return (
    <AriaGridList
      data-slot="list-view"
      className={cn(
        "flex w-full flex-col gap-0.5 rounded-lg border border-border p-1 outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30 data-[empty]:justify-center data-[empty]:py-6 data-[empty]:text-center data-[empty]:text-xs/relaxed data-[empty]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ListViewItem({
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
      data-slot="list-view-item"
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      className={cn(
        "group/list-view-item flex h-8 items-center gap-2 rounded-md px-2 text-xs/relaxed transition-colors outline-none data-[hovered]:bg-accent data-[hovered]:text-accent-foreground data-[selected]:bg-accent data-[selected]:text-accent-foreground data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {({ selectionMode, selectionBehavior }) => (
        <>
          {selectionMode !== "none" && selectionBehavior === "toggle" && (
            <CollectionCheckbox />
          )}
          {children}
        </>
      )}
    </AriaGridListItem>
  )
}

export { CollectionCheckbox, ListView, ListViewItem }
