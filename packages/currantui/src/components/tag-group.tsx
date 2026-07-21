import * as React from "react"
import {
  Button as AriaButton,
  Label as AriaLabel,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  Text as AriaText,
} from "react-aria-components"

import { XIcon } from "@phosphor-icons/react"
import { dateFieldLabelClasses } from "@nhic/currantui/components/date-field"
import { cn } from "@nhic/currantui/lib/utils"
import type {
  TagGroupProps as AriaTagGroupProps,
  TagListProps as AriaTagListProps,
  TagProps as AriaTagProps,
} from "react-aria-components"

/**
 * Interactive tag collection: keyboard-navigable, optionally removable
 * (`onRemove` on the group) and selectable (`selectionMode`). For static
 * status chips use Badge; for filter-bar affordances use FilterChip.
 */
function TagGroup<T extends object>({
  label,
  description,
  items,
  children,
  renderEmptyState,
  className,
  ...props
}: Omit<AriaTagGroupProps, "className" | "children"> &
  Pick<AriaTagListProps<T>, "items" | "children" | "renderEmptyState"> & {
    className?: string
    label?: React.ReactNode
    description?: React.ReactNode
  }) {
  return (
    <AriaTagGroup
      data-slot="tag-group"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {label != null && (
        <AriaLabel data-slot="tag-group-label" className={dateFieldLabelClasses}>
          {label}
        </AriaLabel>
      )}
      <AriaTagList
        data-slot="tag-group-list"
        items={items}
        renderEmptyState={renderEmptyState}
        className="flex flex-wrap gap-1"
      >
        {children}
      </AriaTagList>
      {description != null && (
        <AriaText
          data-slot="tag-group-description"
          slot="description"
          className="text-xs/relaxed text-muted-foreground"
        >
          {description}
        </AriaText>
      )}
    </AriaTagGroup>
  )
}

function Tag({
  children,
  className,
  ...props
}: Omit<AriaTagProps, "className"> & { className?: string }) {
  const textValue = typeof children === "string" ? children : undefined

  return (
    <AriaTag
      data-slot="tag"
      textValue={textValue}
      className={cn(
        /* Inactive tags are a soft secondary tint with foreground ink so they
           read as unselected; only selection fills solid */
        "inline-flex h-5 cursor-default items-center gap-1 rounded-full border border-secondary/30 bg-secondary/15 px-2 text-xs font-medium text-foreground transition-colors outline-none data-[hovered]:bg-secondary/25 data-[selected]:border-transparent data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {({ allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && (
            <AriaButton
              slot="remove"
              aria-label="Remove"
              className="-me-0.5 flex size-3 shrink-0 items-center justify-center rounded-full outline-none transition-colors data-[hovered]:bg-foreground/15 data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30 [&_svg]:size-2.5 [&_svg]:shrink-0"
            >
              <XIcon />
            </AriaButton>
          )}
        </>
      )}
    </AriaTag>
  )
}

export { Tag, TagGroup }
