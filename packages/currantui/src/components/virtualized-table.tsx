import * as React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nhic/currantui/components/table"
import { cn } from "@nhic/currantui/lib/utils"

export interface VirtualizedTableColumn<TRow> {
  header: string
  value: (row: TRow) => React.ReactNode
  align?: "start" | "end"
}

export interface VirtualizedTableProps<TRow> {
  rows: ReadonlyArray<TRow>
  columns: Array<VirtualizedTableColumn<TRow>>
  /** Scroll viewport height in px; default 480 */
  height?: number
  /** Row height estimate in px (rows are measured after render); default 36 */
  estimatedRowHeight?: number
  getRowKey?: (row: TRow, index: number) => React.Key
  /** Screen-reader caption; state the total row count — AT only sees rendered rows */
  caption: string
  onRowClick?: (row: TRow) => void
  className?: string
}

function VirtualizedTable<TRow>({
  rows,
  columns,
  height = 480,
  estimatedRowHeight = 36,
  getRowKey,
  caption,
  onRowClick,
  className,
}: VirtualizedTableProps<TRow>) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const bodyRef = React.useRef<HTMLTableSectionElement>(null)
  const [listOffset, setListOffset] = React.useState(0)

  // The caption + sticky header occupy space above the tbody inside the same
  // scroll element, so the virtualizer's range math needs their height as scrollMargin
  React.useLayoutEffect(() => {
    const body = bodyRef.current
    const viewport = viewportRef.current
    if (body && viewport) {
      setListOffset(
        body.getBoundingClientRect().top -
          viewport.getBoundingClientRect().top +
          viewport.scrollTop
      )
    }
  }, [])

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: 10,
    scrollMargin: listOffset,
  })
  const items = virtualizer.getVirtualItems()
  const paddingTop =
    items.length > 0 ? Math.max(0, items[0].start - virtualizer.options.scrollMargin) : 0
  const paddingBottom =
    items.length > 0
      ? virtualizer.getTotalSize() - items[items.length - 1].end
      : 0
  const interactive = Boolean(onRowClick)

  return (
    <div
      ref={viewportRef}
      data-slot="virtualized-table-viewport"
      tabIndex={0}
      className={cn(
        "overflow-y-auto rounded-md ring-1 ring-foreground/10 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      style={{ height }}
    >
      <table className="w-full caption-bottom text-sm">
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.header}
                scope="col"
                className={cn(column.align === "end" && "text-end")}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody ref={bodyRef}>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                No rows to display
              </TableCell>
            </TableRow>
          ) : (
            <>
              {paddingTop > 0 && (
                <tr data-slot="virtual-spacer" aria-hidden="true">
                  <td colSpan={columns.length} style={{ height: paddingTop, padding: 0 }} />
                </tr>
              )}
              {items.map((item) => {
                const row = rows[item.index]
                return (
                  <TableRow
                    key={getRowKey?.(row, item.index) ?? item.index}
                    data-index={item.index}
                    ref={virtualizer.measureElement}
                    tabIndex={interactive ? 0 : undefined}
                    className={cn(
                      interactive &&
                        "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                    onClick={interactive ? () => onRowClick!(row) : undefined}
                    onKeyDown={
                      interactive
                        ? (event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault()
                              onRowClick!(row)
                            }
                          }
                        : undefined
                    }
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.header}
                        className={cn(
                          column.align === "end" && "text-end tabular-nums"
                        )}
                      >
                        {column.value(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
              {paddingBottom > 0 && (
                <tr data-slot="virtual-spacer" aria-hidden="true">
                  <td
                    colSpan={columns.length}
                    style={{ height: paddingBottom, padding: 0 }}
                  />
                </tr>
              )}
            </>
          )}
        </TableBody>
      </table>
    </div>
  )
}

export { VirtualizedTable }
