import { resolveTokenColor } from "@nhic/currantui-charts/lib/theme"

import type { ImageExportOptions } from "@nhic/currantui-charts/lib/use-echart"

export function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return slug || "chart"
}

function downloadUrl(url: string, filename: string): void {
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
}

/**
 * Export the rendered chart as an image. The card token is painted underneath
 * for both formats — JPEG has no alpha channel, and a transparent PNG would be
 * unreadable on mismatched surfaces.
 */
export function downloadChartImage(
  getDataURL: (options: ImageExportOptions) => string | undefined,
  options: { type: "png" | "jpeg"; title: string }
): void {
  const url = getDataURL({
    type: options.type,
    pixelRatio: 2,
    backgroundColor: resolveTokenColor("--card"),
  })
  if (!url) return
  const extension = options.type === "jpeg" ? "jpg" : "png"
  downloadUrl(url, `${slugifyTitle(options.title)}.${extension}`)
}
