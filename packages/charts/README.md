# @nhic/currantui-charts

Data visualization components for the National Health Intelligence Center (NHIC) design system, built on [Apache ECharts](https://echarts.apache.org) and themed by [CurrantUI](https://www.npmjs.com/package/@nhic/currantui) tokens.

Every chart ships in a consistent card shell with a show-table toggle (accessible data table of the same data), fullscreen view, CSV/PNG/JPG export, an HTML legend, and a footer carrying the data source and attribution.

## Installation

```bash
pnpm add @nhic/currantui-charts @nhic/currantui
```

CurrantUI's stylesheet provides the design tokens (including the dataviz palette), so consumers keep the single CSS import:

```css
@import "@nhic/currantui/globals.css";
```

## Usage

```tsx
import { BarChart } from "@nhic/currantui-charts/components/bar-chart"

const data = [
  { group: "Dataset 1", key: "Qty", value: 65000 },
  { group: "Dataset 2", key: "Qty", value: 32000 },
]

<BarChart
  data={data}
  options={{
    title: "Pre-selected groups (grouped bar)",
    source: "HMIS 2026",
    mode: "grouped",
  }}
/>
```

Charts take tabular `data` rows (default shape `{ group, key, value }`) plus a typed `options` object per chart. The table view and CSV export derive from the same rows.

## Chart types

Bar (grouped/stacked × vertical/horizontal), Line, Area (+stacked), Combo (mixed bar/line, optional secondary axis), Pie, Donut (HTML center label), Gauge (status threshold zones), Meter (proportional bar), Scatter, Bubble (area-true size scale), Histogram (internal binning), Boxplot (computed quartiles and outliers), Heatmap (sequential ramp), and Treemap (drill-down hierarchy).

Import each from its own subpath, e.g. `@nhic/currantui-charts/components/line-chart`. Legends are HTML and clickable — hiding a series keeps its color bound to its group.

## Accessibility

The chart canvas is exposed as a labelled image; the interactive, screen-reader-friendly surface is the HTML shell around it — labelled toolbar controls, a real list legend, and the built-in table view of the underlying data.

## License

Apache-2.0
