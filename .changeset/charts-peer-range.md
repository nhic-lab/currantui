---
"@nhic/currantui-charts": patch
---

Widen the `@nhic/currantui` peer range to `>=0.5.0`. The previous `workspace:^` range made every 0.x minor of the design system fall out of range, which changesets escalates to a lockstep MAJOR of the charts package — charts now versions only off its own changes.
