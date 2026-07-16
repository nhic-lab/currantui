# @nhic/currantui-charts

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
