---
"@nhic/currantui-charts": patch
---

Upgrade Apache ECharts from 5.6 to 6.1 to resolve GHSA advisory: an XSS in the Lines series tooltip where `series.data[i].name` was rendered as raw HTML through the built-in tooltip formatter (fixed in echarts 6.1.0).
