export const PALETTE_SIZE = 14

let sharedContext: CanvasRenderingContext2D | null = null

/**
 * Resolve any authored CSS color (oklch tokens included) to an rgba() string
 * via a 1x1 canvas readback — the canvas renderer's own color math only
 * understands hex/rgb/hsl, so tokens must not reach it as oklch strings.
 */
function resolveColor(value: string): string {
  sharedContext ??= document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true })
  if (!sharedContext || !value) return value
  const ctx = sharedContext
  ctx.canvas.width = 1
  ctx.canvas.height = 1
  ctx.fillStyle = value
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`
}

/**
 * Resolve a CurrantUI token (e.g. "--card") to a concrete rgba() color.
 * Safe during server rendering (returns "") — option builders call this from
 * render, and the value is only consumed by the client-side canvas.
 */
export function resolveTokenColor(token: string, alpha?: number): string {
  if (typeof document === "undefined") return ""
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim()
  const color = resolveColor(value)
  if (alpha === undefined) return color
  return color.replace(
    /rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/,
    (_, r: string, g: string, b: string, a: string) =>
      `rgba(${r}, ${g}, ${b}, ${(Number(a) * alpha).toFixed(3)})`
  )
}

let paletteCache: { dark: boolean; colors: Array<string> } | null = null

function isDarkMode(): boolean {
  return document.documentElement.classList.contains("dark")
}

/** The CurrantUI dataviz palette (chart-1..14) resolved for the active theme */
export function getPalette(): Array<string> {
  const dark = isDarkMode()
  if (paletteCache?.dark !== dark) {
    const styles = getComputedStyle(document.documentElement)
    paletteCache = {
      dark,
      colors: Array.from({ length: PALETTE_SIZE }, (_, i) =>
        resolveColor(styles.getPropertyValue(`--chart-${i + 1}`).trim())
      ),
    }
  }
  return paletteCache.colors
}

/** Series color for a zero-based series index, in fixed palette order */
export function getPaletteColor(index: number): string {
  const palette = getPalette()
  return palette[index % palette.length] ?? ""
}

/**
 * CSS variable reference for a zero-based series index. Safe to use during
 * render (no DOM access) and theme-reactive for free — use for HTML surfaces
 * like legend swatches; the palette order matches the canvas series order.
 */
export function paletteVar(index: number): string {
  return `var(--chart-${(index % PALETTE_SIZE) + 1})`
}

/**
 * Build the token-driven ECharts theme for the active light/dark mode. Read at
 * chart init time so palette or token tuning never requires a charts release.
 */
export function buildChartTheme(): Record<string, unknown> {
  const styles = getComputedStyle(document.documentElement)
  const token = (name: string) => resolveColor(styles.getPropertyValue(name).trim())

  const inkMuted = token("--muted-foreground")
  const line = token("--border")
  const fontFamily = styles.getPropertyValue("--font-sans").trim() || "sans-serif"

  const axisText = {
    color: inkMuted,
    fontFamily,
    fontSize: 12,
  }
  const domainAxis = {
    axisLine: { show: true, lineStyle: { color: line } },
    axisTick: { show: false },
    axisLabel: axisText,
    nameTextStyle: axisText,
    splitLine: { show: false },
  }
  const measureAxis = {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: axisText,
    nameTextStyle: axisText,
    splitLine: { show: true, lineStyle: { color: line } },
  }

  return {
    color: getPalette(),
    textStyle: { color: inkMuted, fontFamily, fontSize: 12 },
    categoryAxis: domainAxis,
    valueAxis: measureAxis,
    timeAxis: domainAxis,
    logAxis: measureAxis,
    tooltip: {
      backgroundColor: token("--popover"),
      borderColor: line,
      textStyle: {
        color: token("--popover-foreground"),
        fontFamily,
        fontSize: 12,
      },
    },
  }
}
