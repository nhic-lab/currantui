import * as React from "react"
import {
  ArrowsInIcon,
  ArrowsOutIcon,
  ChartBarIcon,
  DotsThreeVerticalIcon,
  TableIcon,
} from "@phosphor-icons/react"

import { Button } from "@nhic/currantui/components/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@nhic/currantui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nhic/currantui/components/dropdown-menu"
import { EmptyState } from "@nhic/currantui/components/empty-state"
import { Skeleton } from "@nhic/currantui/components/skeleton"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nhic/currantui/components/table"
import { exportRowsToCsv } from "@nhic/currantui/lib/export-csv"
import { cn } from "@nhic/currantui/lib/utils"
import { ChartLegend } from "@nhic/currantui-charts/components/chart-legend"
import {
  downloadChartImage,
  slugifyTitle,
} from "@nhic/currantui-charts/lib/export"
import { formatCell } from "@nhic/currantui-charts/lib/format"
import { useEChart } from "@nhic/currantui-charts/lib/use-echart"

import type { EChartsCoreOption, EChartsType } from "echarts/core"
import type { ChartLegendItem } from "@nhic/currantui-charts/components/chart-legend"
import type { ChartTableColumn } from "@nhic/currantui-charts/lib/table-columns"
import type { BaseChartOptions } from "@nhic/currantui-charts/lib/types"
import type { ImageExportOptions } from "@nhic/currantui-charts/lib/use-echart"

export interface ChartBuildContext {
  /** Groups toggled off via the legend; empty until legend toggling ships */
  hiddenGroups: ReadonlySet<string>
}

export interface ChartShellProps<TRow> {
  options: BaseChartOptions
  /** Tabular truth behind the chart; feeds the table view and CSV export */
  rows: ReadonlyArray<TRow>
  tableColumns: Array<ChartTableColumn<TRow>>
  legendItems?: Array<ChartLegendItem>
  /** Replaces the swatch legend (e.g. a continuous ramp for heatmaps) */
  legendContent?: React.ReactNode
  /** Must be referentially stable (memoized) — it keys the canvas update */
  buildOption: (context: ChartBuildContext) => EChartsCoreOption
  /** HTML centered over the canvas (donut/gauge value labels); ignores pointer events */
  overlay?: React.ReactNode
  /**
   * Fires with each created canvas instance (inline and fullscreen, including
   * theme re-inits) and null on unmount — for charts that drive frames
   * imperatively (bar race). Prune disposed instances via `isDisposed()`.
   */
  onCanvasInstance?: (chart: EChartsType | null) => void
  className?: string
}

interface ChartCanvasHandle {
  getDataURL: (options: ImageExportOptions) => string | undefined
}

function ChartCanvas({
  build,
  label,
  onInstance,
  ref,
}: {
  build: () => EChartsCoreOption
  label: string
  onInstance?: (chart: EChartsType | null) => void
  ref?: React.Ref<ChartCanvasHandle>
}) {
  const { containerRef, getDataURL } = useEChart(build, onInstance)
  React.useImperativeHandle(ref, () => ({ getDataURL }), [getDataURL])
  return (
    // The canvas is opaque to assistive tech; expose it as a labelled image
    // and keep the HTML shell (toolbar, legend, table view) as the
    // accessible surface.
    <div role="img" aria-label={label} className="h-full w-full">
      <div ref={containerRef} aria-hidden="true" className="h-full w-full" />
    </div>
  )
}

function ChartDataTable<TRow>({
  title,
  rows,
  columns,
}: {
  title: string
  rows: ReadonlyArray<TRow>
  columns: Array<ChartTableColumn<TRow>>
}) {
  return (
    <div data-slot="chart-table" className="h-full overflow-y-auto">
      <Table>
        <TableCaption className="sr-only">{title} data table</TableCaption>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.header}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.header} className="tabular-nums">
                  {formatCell(column.value(row))}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ChartFrame<TRow>({
  options,
  rows,
  tableColumns,
  legendItems,
  legendContent,
  buildOption,
  overlay,
  onCanvasInstance,
  className,
  view,
  onViewChange,
  hiddenGroups,
  onToggleGroup,
  fullscreen = false,
  onFullscreenChange,
  fill = false,
}: ChartShellProps<TRow> & {
  view: "chart" | "table"
  onViewChange: (view: "chart" | "table") => void
  hiddenGroups: ReadonlySet<string>
  onToggleGroup: (group: string) => void
  fullscreen?: boolean
  onFullscreenChange?: (open: boolean) => void
  /** Fill the parent height (fullscreen dialog) instead of options.height */
  fill?: boolean
}) {
  const {
    title,
    description,
    source,
    attribution = "Health Intelligence Center",
    height = 320,
    legend,
    loading = false,
    emptyState,
    toolbar,
  } = options

  const canvasRef = React.useRef<ChartCanvasHandle>(null)
  const build = React.useMemo(
    () => () => buildOption({ hiddenGroups }),
    [buildOption, hiddenGroups]
  )
  const empty = rows.length === 0
  const tableView = view === "table"

  const exportImage = (type: "png" | "jpeg") => {
    downloadChartImage((opts) => canvasRef.current?.getDataURL(opts), {
      type,
      title,
    })
  }

  return (
    <div
      data-slot="chart"
      role="group"
      aria-label={title}
      className={cn(
        "flex flex-col gap-3 rounded-lg bg-card p-4 text-xs/relaxed text-card-foreground ring-1 ring-foreground/10",
        fill && "h-full min-h-0 rounded-none p-0 ring-0",
        className
      )}
    >
      <div data-slot="chart-header" className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div data-slot="chart-title" className="font-heading text-sm font-semibold">
            {title}
          </div>
          {description && (
            <div
              data-slot="chart-description"
              className="text-xs/relaxed text-muted-foreground"
            >
              {description}
            </div>
          )}
        </div>
        <div
          data-slot="chart-toolbar"
          role="toolbar"
          aria-label="Chart tools"
          className="flex shrink-0 items-center gap-0.5"
        >
          {toolbar?.table !== false && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Show table view"
              aria-pressed={tableView}
              disabled={loading || empty}
              onClick={() => onViewChange(tableView ? "chart" : "table")}
            >
              <TableIcon />
            </Button>
          )}
          {toolbar?.fullscreen !== false && onFullscreenChange && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Fullscreen"
              aria-pressed={fullscreen}
              disabled={loading}
              onClick={() => onFullscreenChange(!fullscreen)}
            >
              {fullscreen ? <ArrowsInIcon /> : <ArrowsOutIcon />}
            </Button>
          )}
          {toolbar?.export !== false && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="More options"
                  disabled={loading || empty}
                >
                  <DotsThreeVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() =>
                    exportRowsToCsv([...rows], tableColumns, slugifyTitle(title))
                  }
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={tableView}
                  onSelect={() => exportImage("png")}
                >
                  Export as PNG
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={tableView}
                  onSelect={() => exportImage("jpeg")}
                >
                  Export as JPG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div
        data-slot="chart-body"
        className={cn("w-full", fill && "min-h-0 flex-1")}
        style={fill ? undefined : { height }}
      >
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : empty ? (
          <EmptyState
            icon={<ChartBarIcon />}
            title={emptyState?.title ?? "No data to display"}
            description={emptyState?.description}
            className="h-full"
          />
        ) : tableView ? (
          <ChartDataTable title={title} rows={rows} columns={tableColumns} />
        ) : (
          <div className="relative h-full w-full">
            <ChartCanvas
              ref={canvasRef}
              build={build}
              label={description ? `${title}. ${description}` : title}
              onInstance={onCanvasInstance}
            />
            {overlay && (
              <div
                data-slot="chart-overlay"
                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
              >
                {overlay}
              </div>
            )}
          </div>
        )}
      </div>
      {legend?.enabled !== false &&
        !loading &&
        !empty &&
        (legendContent ??
          (legendItems && legendItems.length > 1 && (
            <ChartLegend
              items={legendItems}
              hiddenLabels={hiddenGroups}
              onToggleItem={onToggleGroup}
            />
          )))}
      <div
        data-slot="chart-footer"
        className="flex items-center justify-between gap-2 text-[0.625rem] text-muted-foreground tabular-nums"
      >
        <span data-slot="chart-source">{source ? `Source: ${source}` : null}</span>
        <span data-slot="chart-attribution">{attribution}</span>
      </div>
    </div>
  )
}

/**
 * Shared card around every chart: title header, toolbar (table view,
 * fullscreen, CSV/PNG/JPG export), HTML legend, and a source/attribution
 * footer. Chart components build their ECharts option and delegate the rest
 * of the surface to this shell. Fullscreen renders a second chart instance in
 * a Dialog — a canvas cannot be reparented without re-initializing anyway.
 */
function ChartShell<TRow>(props: ChartShellProps<TRow>) {
  const [view, setView] = React.useState<"chart" | "table">("chart")
  const [fullscreen, setFullscreen] = React.useState(false)
  const [hiddenGroups, setHiddenGroups] = React.useState<ReadonlySet<string>>(
    new Set()
  )

  const toggleGroup = React.useCallback((group: string) => {
    setHiddenGroups((current) => {
      const next = new Set(current)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })
  }, [])

  return (
    <>
      <ChartFrame
        {...props}
        view={view}
        onViewChange={setView}
        hiddenGroups={hiddenGroups}
        onToggleGroup={toggleGroup}
        onFullscreenChange={setFullscreen}
      />
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent
          className="h-[90vh] w-[95vw] max-w-none grid-rows-[1fr] sm:max-w-none"
          aria-describedby={undefined}
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">{props.options.title}</DialogTitle>
          <ChartFrame
            {...props}
            view={view}
            onViewChange={setView}
            hiddenGroups={hiddenGroups}
            onToggleGroup={toggleGroup}
            fullscreen
            onFullscreenChange={setFullscreen}
            fill
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export { ChartShell }
