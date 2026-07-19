import * as React from "react"
import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react"

import { pivotData, valueLabel } from "@nhic/currantui/lib/pivot"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nhic/currantui/components/table"
import { cn } from "@nhic/currantui/lib/utils"

import type {
  PivotColumnKey,
  PivotConfig,
  PivotRowNode,
} from "@nhic/currantui/lib/pivot"

export interface PivotTableProps {
  data: Array<Record<string, unknown>>
  config: PivotConfig
  /** Nodes shallower than this render expanded initially; default 1 */
  defaultExpandedDepth?: number
  /** Screen-reader table caption */
  caption: string
  className?: string
}

function formatCell(column: PivotColumnKey, value: number | undefined): string {
  if (value === undefined) return "—"
  return column.value.formatter?.(value) ?? value.toLocaleString()
}

function collectExpandable(
  nodes: Array<PivotRowNode>,
  maxDepth: number,
  into: Set<string>
): Set<string> {
  for (const node of nodes) {
    if (node.children.length > 0 && node.depth < maxDepth) {
      into.add(node.key)
      collectExpandable(node.children, maxDepth, into)
    }
  }
  return into
}

/** Consecutive column keys sharing the same path prefix, for grouped headers */
function headerGroups(
  columnKeys: Array<PivotColumnKey>,
  depth: number
): Array<{ label: string; span: number }> {
  const groups: Array<{ label: string; span: number }> = []
  for (const column of columnKeys) {
    const label = column.path[depth]
    const last = groups.at(-1)
    if (last && last.label === label) last.span += 1
    else groups.push({ label, span: 1 })
  }
  return groups
}

function PivotTable({
  data,
  config,
  defaultExpandedDepth = 1,
  caption,
  className,
}: PivotTableProps) {
  const result = React.useMemo(() => pivotData(data, config), [data, config])
  const [expanded, setExpanded] = React.useState<Set<string>>(() =>
    collectExpandable(result.rows, defaultExpandedDepth, new Set())
  )

  const toggle = (key: string) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const columnFieldCount = config.columns?.length ?? 0
  const headerRowCount = columnFieldCount + 1

  const bodyRows: Array<PivotRowNode> = []
  const flatten = (nodes: Array<PivotRowNode>) => {
    for (const node of nodes) {
      bodyRows.push(node)
      if (node.children.length > 0 && expanded.has(node.key)) flatten(node.children)
    }
  }
  flatten(result.rows)

  return (
    <Table className={className}>
      <TableCaption className="sr-only">{caption}</TableCaption>
      <TableHeader>
        {Array.from({ length: columnFieldCount }, (_, depth) => (
          <TableRow key={depth}>
            {depth === 0 && (
              <TableHead scope="col" rowSpan={headerRowCount}>
                {config.rows.join(" / ")}
              </TableHead>
            )}
            {headerGroups(result.columnKeys, depth).map((group, index) => (
              <TableHead
                key={`${group.label}-${index}`}
                scope="colgroup"
                colSpan={group.span}
                className="text-end"
              >
                {group.label}
              </TableHead>
            ))}
          </TableRow>
        ))}
        <TableRow>
          {columnFieldCount === 0 && (
            <TableHead scope="col">{config.rows.join(" / ")}</TableHead>
          )}
          {result.columnKeys.map((column) => (
            <TableHead key={column.key} scope="col" className="text-end">
              {valueLabel(column.value)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {bodyRows.map((node) => {
          const branch = node.children.length > 0
          return (
            <TableRow
              key={node.key}
              className={cn(branch && "bg-muted/50 font-medium")}
            >
              <TableHead
                scope="row"
                className="font-normal"
                style={{ paddingInlineStart: `${node.depth * 1.25 + 0.5}rem` }}
              >
                <span className="flex items-center gap-1">
                  {branch && (
                    <button
                      type="button"
                      aria-expanded={expanded.has(node.key)}
                      aria-label={`Toggle ${node.label}`}
                      className="-ms-1 rounded p-0.5 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => toggle(node.key)}
                    >
                      {expanded.has(node.key) ? (
                        <CaretDownIcon aria-hidden="true" className="size-3.5" />
                      ) : (
                        <CaretRightIcon aria-hidden="true" className="size-3.5" />
                      )}
                    </button>
                  )}
                  {node.label}
                </span>
              </TableHead>
              {result.columnKeys.map((column) => (
                <TableCell key={column.key} className="text-end tabular-nums">
                  {formatCell(column, node.cells.get(column.key))}
                </TableCell>
              ))}
            </TableRow>
          )
        })}
        <TableRow className="border-t font-semibold">
          <TableHead scope="row">Total</TableHead>
          {result.columnKeys.map((column) => (
            <TableCell key={column.key} className="text-end tabular-nums">
              {formatCell(column, result.totals.get(column.key))}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  )
}

export { PivotTable }
export type { PivotConfig }
