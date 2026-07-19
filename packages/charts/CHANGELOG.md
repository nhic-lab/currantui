# @nhic/currantui-charts

## 1.2.0

### Minor Changes

- 84158a2: Add cross-filtering: CrossFilterProvider + useCrossFilter coordinate mark selections (click replaces or clears, Ctrl/Cmd-click accumulates, dimensions AND-combine); categorical charts accept a crossFilter binding that emits selections and dims non-matching marks on shared dimensions; CrossFilterBar renders active selections as dismissible chips with clear-all.
- d099d10: Add geo support: registerGeoMap registers app-supplied GeoJSON boundaries behind an idempotent typed wrapper, and ChoroplethChart renders region-shaded maps on the standard chart shell (continuous token-colored scale, ramp legend, no-data fills, table view and exports) with full cross-filtering — clicking a region toggles a selection on the bound dimension.

## 1.1.0

### Minor Changes

- 8876bd3: Step the rendered type scale up to enterprise dashboard sizes: control and body text moves from 12px to 14px (`text-sm`), helper/meta text standardizes on 12px (`text-xs`), page titles move to 20px, and all arbitrary micro font sizes are replaced — nothing renders below 12px except a new `text-2xs` (10px) token reserved for size-constrained avatar internals.

### Patch Changes

- d6ef043: Widen the `@nhic/currantui` peer range to `>=0.5.0`. The previous `workspace:^` range made every 0.x minor of the design system fall out of range, which changesets escalates to a lockstep MAJOR of the charts package — charts now versions only off its own changes.

## 1.0.1

### Patch Changes

- 4ed1b0b: Upgrade Apache ECharts from 5.6 to 6.1 to resolve GHSA advisory: an XSS in the Lines series tooltip where `series.data[i].name` was rendered as raw HTML through the built-in tooltip formatter (fixed in echarts 6.1.0).

## 1.0.0

### Minor Changes

- 5c567ba: Legend items are now toggle buttons: clicking one hides or shows its series (dimmed strikethrough while hidden), with the state shared between the inline and fullscreen views. Hidden series keep their palette slot, so colors stay bound to their group instead of shifting onto the remaining series. Applies across the bar, line, area, combo, scatter, bubble, pie, donut, meter, and treemap charts.
- 5ba86c8: Add the part-to-whole and status chart family: `PieChart`, `DonutChart` (HTML center label), `GaugeChart` (270° arc with status-toned threshold zones and an HTML value overlay), and `MeterChart` (compact proportional linear meter with share tooltips). The chart shell gains an `overlay` slot for HTML centered over the canvas, and `useEChart` now takes the option builder so token-resolved colors are rebuilt on theme change instead of staying baked under the previous theme.
- 5c567ba: Add `RaceBarChart`, an animated bar race: horizontal bars re-rank as the animation steps through the data's `key` frames (e.g. years), with play/pause controls, a frame indicator, an optional `topN` cutoff, and value labels that animate with the bars. Colors are assigned per group and stay bound across frames; frames merge into the live canvas so re-sorting animates smoothly, and the table view and CSV export carry every frame's rows.
- 4099abb: Add the matrix and hierarchy charts: `HeatmapChart` (category×category grid with a single-hue sequential ramp and a new HTML `ChartRampLegend`) and `TreemapChart` (hierarchical part-to-whole with click drill-down and a flattened path/value table view that sums branch totals from children). The chart shell gains a `legendContent` slot for continuous-scale legends.
- 2ad8956: Add the axis chart family: `LineChart` (linear/smooth curve, optional point markers), `AreaChart` (light overlapping fills or stacked cumulative mode), and `ComboChart` (mixed bar/line marks per group with an optional secondary value axis for series on a different scale).
- 47b97f1: Add the statistical chart family: `ScatterChart` (two measures per group), `BubbleChart` (third measure encoded as mark area via a square-root scale), `HistogramChart` (internal binning with round 1/2/5-step edges, Sturges' rule by default), and `BoxplotChart` (type-7 quartiles, 1.5×IQR whiskers, outlier marks). The new `lib/stats` module exposes `binRows`, `computeBoxStats`, and `scaleSqrt`; histogram and boxplot table/CSV views report the computed distribution and five-number summaries.
- d4f7fcc: Initial release of `@nhic/currantui-charts`, the CurrantUI data visualization package built on Apache ECharts. Ships the shared chart shell — show-table toggle, fullscreen, CSV/PNG/JPG export, HTML legend, and a source/attribution footer — plus the BarChart component (grouped/stacked, vertical/horizontal) and the token-driven theming core (`useEChart`, palette/theme readers, option builders).

### Patch Changes

- Updated dependencies [d4f7fcc]
  - @nhic/currantui@0.5.0
