---
"@nhic/currantui": minor
---

Add the rich-table presentation primitives: `TableSelectionBar` (bulk-action strip with the `blurFocusedRowControl` focus-trap fix built in), `TableEmptyState`, `TableFooterCount`, `TablePagination` (footer strip with first/prev/next/last controls, optional rows-per-page selector, and a left slot for counts), `SortIndicator`, and the `exportRowsToCsv` utility (`@nhic/currantui/lib/export-csv`). These are state-library-agnostic — pair them with TanStack Table (or anything else) using the copy-paste "Recipes/Rich Table" story in Storybook, which reproduces the eRadia worklist look end to end. Contrast fixes found by the a11y gate along the way: the selection bar's Clear button now uses `text-foreground/70`.
