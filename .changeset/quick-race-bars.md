---
"@nhic/currantui-charts": minor
---

Add `RaceBarChart`, an animated bar race: horizontal bars re-rank as the animation steps through the data's `key` frames (e.g. years), with play/pause controls, a frame indicator, an optional `topN` cutoff, and value labels that animate with the bars. Colors are assigned per group and stay bound across frames; frames merge into the live canvas so re-sorting animates smoothly, and the table view and CSV export carry every frame's rows.
