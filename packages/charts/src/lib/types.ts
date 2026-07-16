export interface ChartDataRow {
  /** Series the row belongs to */
  group: string
  /** Category along the domain axis */
  key: string | number
  value: number
}

/** One part of a whole (pie/donut slice, meter segment) */
export interface PartDataRow {
  group: string
  value: number
}

export interface GaugeDataRow {
  value: number
}

export interface ScatterDataRow {
  group: string
  x: number
  y: number
}

export interface BubbleDataRow extends ScatterDataRow {
  /** Encoded as mark area via a square-root size scale */
  size: number
}

export interface BoxplotDataRow {
  group: string
  /** Raw sample; quartiles and outliers are computed per group */
  value: number
}

export interface BaseChartOptions {
  title: string
  description?: string
  /** Rendered in the footer as "Source: {source}" */
  source?: string
  /** Footer right-hand text; defaults to "Health Intelligence Center" */
  attribution?: string
  /** Chart body height in px; defaults to 320 */
  height?: number
  legend?: {
    /** Defaults to true */
    enabled?: boolean
  }
  loading?: boolean
  emptyState?: {
    title?: string
    description?: string
  }
  toolbar?: {
    /** Show-table toggle; defaults to true */
    table?: boolean
    /** Fullscreen button; defaults to true */
    fullscreen?: boolean
    /** Export menu (CSV / PNG / JPG); defaults to true */
    export?: boolean
  }
  /** Formats values in tooltips and the table view */
  valueFormatter?: (value: number) => string
}

export interface AxisOptions {
  label?: string
  formatter?: (value: number) => string
}

export interface AxisChartOptions extends BaseChartOptions {
  xAxis?: AxisOptions
  yAxis?: AxisOptions
}
