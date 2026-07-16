---
"@nhic/currantui-charts": minor
---

Add the statistical chart family: `ScatterChart` (two measures per group), `BubbleChart` (third measure encoded as mark area via a square-root scale), `HistogramChart` (internal binning with round 1/2/5-step edges, Sturges' rule by default), and `BoxplotChart` (type-7 quartiles, 1.5×IQR whiskers, outlier marks). The new `lib/stats` module exposes `binRows`, `computeBoxStats`, and `scaleSqrt`; histogram and boxplot table/CSV views report the computed distribution and five-number summaries.
