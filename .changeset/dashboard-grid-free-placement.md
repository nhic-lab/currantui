---
"@nhic/currantui": minor
---

DashboardGrid: free placement and resize from all eight handles.

`compaction` ("vertical" | "none", default "vertical") makes gravity opt-out. With gravity always on, a tile whose own columns were free above it could not be left on a lower row: dropping a tall chart onto row 2 beside a short number card floated it straight back to row 0. Worse, the settled layout then equalled the pre-gesture layout, so the `layoutsEqual` guard in `finish()` suppressed the commit and `onLayoutChange` never fired — the gesture was not merely undone, it was unobservable, so a consumer could not even correct it. The guard is correct and stays (a genuine no-op must not push history or emit); what changed is that gravity no longer manufactures false no-ops. Under "none" collisions are still resolved, so tiles never overlap — only the upward float is skipped.

Resize now works from all four corners and all four edges (`n`, `s`, `e`, `w`, `ne`, `nw`, `se`, `sw`), each a >=24px hit area carrying `data-handle`. Previously only `se`, `e` and `s` existed and `resizeItem` took no x/y, so a tile's top and left edges could not be dragged at all: `clamp` preserved y, and x moved only as a right-edge clamp artifact. `resizeItem` gained `options.x`/`options.y` and the new pure `resizeRect(origin, handle, dxCells, dyCells, columns)` anchors a north/west drag to the opposite edge, so dragging past `minW` parks the near edge instead of sliding the whole tile.

All eight handles now appear together on widget hover or focus instead of each becoming visible only once the cursor was already on it, which made three handles read as one.

Backward compatible: `compaction` defaults to today's behaviour, the `startResize(id, axis)` vocabulary ("both"/"x"/"y") still maps onto `se`/`e`/`s`, those three handles keep their `data-axis` attribute, and `moveItem`/`resizeItem`/`removeItem` keep their existing signatures with the new arguments optional. A gesture that truly ends where it began now announces "Not moved" / "Not resized" rather than claiming a move that did not happen.
