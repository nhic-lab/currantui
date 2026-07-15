import * as React from "react"
import {
  Button as AriaButton,
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
} from "react-aria-components"

import { CaretRightIcon } from "@phosphor-icons/react"
import { cn } from "@nhic/currantui/lib/utils"
import type {
  TreeItemProps as AriaTreeItemProps,
  TreeProps as AriaTreeProps,
} from "react-aria-components"

/**
 * Hierarchical list with expandable branches (one `TreeViewItem` nested in
 * another). Needs an accessible name via `aria-label`; expansion and
 * selection are controlled with `expandedKeys`/`selectedKeys` or their
 * `default*` counterparts.
 */
function TreeView<T extends object>({
  className,
  ...props
}: Omit<AriaTreeProps<T>, "className"> & { className?: string }) {
  return (
    <AriaTree
      data-slot="tree-view"
      className={cn(
        "flex w-full flex-col gap-0.5 outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30 data-[empty]:py-6 data-[empty]:text-center data-[empty]:text-xs/relaxed data-[empty]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TreeViewItem({
  title,
  icon,
  textValue,
  className,
  children,
  ...props
}: Omit<AriaTreeItemProps, "className" | "children" | "textValue"> & {
  className?: string
  /** Row content; nested TreeViewItems go in `children` */
  title: React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
  /** Derived from `title` when it is a plain string */
  textValue?: string
}) {
  return (
    <AriaTreeItem
      data-slot="tree-view-item"
      textValue={textValue ?? (typeof title === "string" ? title : "item")}
      className={cn(
        "group/tree-view-item rounded-md text-xs/relaxed transition-colors outline-none data-[hovered]:bg-accent data-[hovered]:text-accent-foreground data-[selected]:bg-accent data-[selected]:text-accent-foreground data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <AriaTreeItemContent>
        {({ hasChildItems, level }) => (
          <div
            data-slot="tree-view-item-row"
            className="flex h-7 items-center gap-1 pe-2"
            style={{ paddingInlineStart: `${(level - 1) * 1.25 + 0.25}rem` }}
          >
            {hasChildItems ? (
              <AriaButton
                slot="chevron"
                data-slot="tree-view-item-chevron"
                className="flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors data-[hovered]:bg-muted data-[hovered]:text-foreground data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30"
              >
                <CaretRightIcon
                  aria-hidden="true"
                  className="size-3.5 transition-transform rtl:-scale-x-100 group-data-[expanded]/tree-view-item:rotate-90"
                />
              </AriaButton>
            ) : (
              <span aria-hidden="true" className="size-5 shrink-0" />
            )}
            {icon != null && (
              <span
                aria-hidden="true"
                className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4"
              >
                {icon}
              </span>
            )}
            <span className="truncate">{title}</span>
          </div>
        )}
      </AriaTreeItemContent>
      {children}
    </AriaTreeItem>
  )
}

export { TreeView, TreeViewItem }
