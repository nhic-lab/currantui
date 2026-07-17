import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react"

import { Button } from "@nhic/currantui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nhic/currantui/components/select"
import { cn } from "@nhic/currantui/lib/utils"
import type { ReactNode } from "react"

interface TablePaginationProps {
  /** Current page, 0-based — matches TanStack Table's `pageIndex` */
  pageIndex: number
  pageCount: number
  onPageChange: (pageIndex: number) => void
  /** Rows per page; the selector renders only when onPageSizeChange is provided */
  pageSize?: number
  pageSizeOptions?: Array<number>
  onPageSizeChange?: (pageSize: number) => void
  /** Left slot, e.g. row counts */
  children?: ReactNode
  className?: string
}

export function TablePagination({
  pageIndex,
  pageCount,
  onPageChange,
  pageSize,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange,
  children,
  className,
}: TablePaginationProps) {
  const lastPage = Math.max(pageCount - 1, 0)
  const atStart = pageIndex <= 0
  const atEnd = pageIndex >= lastPage

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-t border-border/50 px-4 py-1 text-xs text-muted-foreground",
        className,
      )}
    >
      {children}
      <div className="ml-auto flex items-center gap-3">
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span>Rows per page</span>
            <Select
              value={String(pageSize ?? pageSizeOptions[0])}
              onValueChange={(v) => onPageSizeChange(Number(v))}
            >
              <SelectTrigger
                size="sm"
                aria-label="Rows per page"
                className="h-6 gap-1 px-2 text-xs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <span className="tabular-nums">
          Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
        </span>
        <div className="flex items-center gap-0.5">
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="First page"
            disabled={atStart}
            onClick={() => onPageChange(0)}
          >
            <CaretDoubleLeftIcon />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Previous page"
            disabled={atStart}
            onClick={() => onPageChange(pageIndex - 1)}
          >
            <CaretLeftIcon />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Next page"
            disabled={atEnd}
            onClick={() => onPageChange(pageIndex + 1)}
          >
            <CaretRightIcon />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Last page"
            disabled={atEnd}
            onClick={() => onPageChange(lastPage)}
          >
            <CaretDoubleRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
