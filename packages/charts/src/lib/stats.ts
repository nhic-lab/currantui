export interface HistogramBin {
  /** Inclusive lower edge */
  x0: number
  /** Exclusive upper edge (inclusive for the last bin) */
  x1: number
  count: number
}

/** Snap a raw width up to a readable 1/2/5 × 10^k step */
function niceWidth(raw: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  for (const step of [1, 2, 5, 10]) {
    if (raw <= step * magnitude) return step * magnitude
  }
  return 10 * magnitude
}

/**
 * Uniform-width binning; the bin count defaults to Sturges' rule and is a
 * target, not exact — widths snap to round 1/2/5 steps and edges align to
 * multiples of the width so bin labels read cleanly. `binWidth` takes
 * precedence over `bins` when both are given.
 */
export function binRows(
  values: ReadonlyArray<number>,
  options?: { bins?: number; binWidth?: number }
): Array<HistogramBin> {
  if (values.length === 0) return []
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min
  if (span === 0) return [{ x0: min, x1: max, count: values.length }]

  const requestedBins = options?.bins ?? Math.ceil(Math.log2(values.length)) + 1
  const width = options?.binWidth ?? niceWidth(span / requestedBins)
  const start = Math.floor(min / width) * width
  const count = Math.max(1, Math.ceil((max - start) / width))
  const bins: Array<HistogramBin> = Array.from({ length: count }, (_, i) => ({
    x0: start + i * width,
    x1: start + (i + 1) * width,
    count: 0,
  }))
  values.forEach((value) => {
    const index = Math.min(count - 1, Math.floor((value - start) / width))
    const bin = bins[index]
    bin.count += 1
  })
  return bins
}

export interface BoxStats {
  /** Lower whisker: smallest sample within 1.5×IQR below Q1 */
  low: number
  q1: number
  median: number
  q3: number
  /** Upper whisker: largest sample within 1.5×IQR above Q3 */
  high: number
  outliers: Array<number>
}

/** Linear-interpolated (type-7) quantile of a sorted sample */
function quantileSorted(sorted: ReadonlyArray<number>, p: number): number {
  const position = (sorted.length - 1) * p
  const base = Math.floor(position)
  const lower = sorted[base]
  const upper = sorted[Math.min(base + 1, sorted.length - 1)]
  return lower + (upper - lower) * (position - base)
}

/** Five-number summary with 1.5×IQR whiskers; samples beyond them are outliers */
export function computeBoxStats(values: ReadonlyArray<number>): BoxStats | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const q1 = quantileSorted(sorted, 0.25)
  const median = quantileSorted(sorted, 0.5)
  const q3 = quantileSorted(sorted, 0.75)
  const iqr = q3 - q1
  const lowFence = q1 - 1.5 * iqr
  const highFence = q3 + 1.5 * iqr
  // Never empty: the fences always contain the quartile samples themselves
  const inliers = sorted.filter((v) => v >= lowFence && v <= highFence)
  return {
    low: inliers[0],
    q1,
    median,
    q3,
    high: inliers[inliers.length - 1],
    outliers: sorted.filter((v) => v < lowFence || v > highFence),
  }
}

/**
 * Area-true size scale for bubble marks: symbol *area* grows linearly with
 * the value, so the rendered diameter follows the square root.
 */
export function scaleSqrt(
  domain: [number, number],
  range: [number, number]
): (value: number) => number {
  const [d0, d1] = domain
  const [r0, r1] = range
  const s0 = Math.sqrt(Math.max(0, d0))
  const s1 = Math.sqrt(Math.max(0, d1))
  if (s1 === s0) return () => (r0 + r1) / 2
  return (value) =>
    r0 + ((Math.sqrt(Math.max(0, value)) - s0) / (s1 - s0)) * (r1 - r0)
}
