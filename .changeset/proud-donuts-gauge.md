---
"@nhic/currantui-charts": minor
---

Add the part-to-whole and status chart family: `PieChart`, `DonutChart` (HTML center label), `GaugeChart` (270° arc with status-toned threshold zones and an HTML value overlay), and `MeterChart` (compact proportional linear meter with share tooltips). The chart shell gains an `overlay` slot for HTML centered over the canvas, and `useEChart` now takes the option builder so token-resolved colors are rebuilt on theme change instead of staying baked under the previous theme.
