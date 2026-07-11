---
"@nhic/currantui": minor
---

Add the rich-table presentation primitives: `TableSelectionBar` (bulk-action strip with the `blurFocusedRowControl` focus-trap fix built in), `TableEmptyState`, `TableFooterCount`, `TablePagination` (footer strip with first/prev/next/last controls, optional rows-per-page selector, and a left slot for counts), `SortIndicator`, `TableToolbar` (+ `TableToolbarSeparator`/`TableToolbarLabel` — the filter/search strip above a table), `FilterChip` (pill filter toggle, with `filterChipVariants` exported for chip-shaped triggers), `SearchField`, and the `exportRowsToCsv` utility (`@nhic/currantui/lib/export-csv`). These are state-library-agnostic — pair them with TanStack Table (or anything else) using the copy-paste "Recipes/Rich Table" story in Storybook, which demonstrates the full worklist-style table end to end. Contrast fixes found by the a11y gate along the way: the selection bar's Clear button now uses `text-foreground/70`.
