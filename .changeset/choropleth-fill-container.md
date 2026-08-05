---
"@nhic/currantui-charts": patch
---

Fill the container in ChoroplethChart. The map series set no `layoutCenter`/`layoutSize`, so echarts rendered the map at a small default scale centered in the chart body, leaving large empty margins. Adding `layoutCenter: ["50%", "50%"]` and `layoutSize: "100%"` scales the geometry to the smaller container dimension so the map fills the available area.
