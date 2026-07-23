---
"@nhic/currantui-charts": patch
---

Remove a dead grid-rows utility from the fullscreen chart dialog — DialogContent's internal layout is flex-column, so the class no longer applied; fullscreen sizing is unchanged.
