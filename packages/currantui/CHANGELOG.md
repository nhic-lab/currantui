# @nhic/currantui

## 0.3.0

### Minor Changes

- 51f54e7: Component fixes and additions surfaced by the Storybook workbench:

  - `NotificationsButton` can now open a notification panel — pass `count` and compose the new `NotificationList` + `NotificationItem` exports as children; without children it stays the original tooltip-only bell.
  - `Loader` actually spins: the `orbit-spin` keyframes it references were missing and are now defined in `globals.css`.
  - `Input` with `type="file"` shows a leading folder icon.
  - `ErrorPage` content blocks use one even vertical rhythm, with the detail lines grouped as a paragraph.
  - `ThemeToggle` persists under the `currantui-theme` localStorage key (previously a legacy app-specific name); a theme preference saved by an earlier version resets to system default once. It also now derives its state from the `dark` class on `<html>` (observed live) instead of localStorage, so it stays correct when something else — a pre-paint script, another toggle instance — changes the theme, and the first click is never a no-op.

- 5a9727a: Add the rich-table presentation primitives: `TableSelectionBar` (bulk-action strip with the `blurFocusedRowControl` focus-trap fix built in), `TableEmptyState`, `TableFooterCount`, `TablePagination` (footer strip with first/prev/next/last controls, optional rows-per-page selector, and a left slot for counts), `SortIndicator`, `TableToolbar` (+ `TableToolbarSeparator`/`TableToolbarLabel` — the filter/search strip above a table), `FilterChip` (pill filter toggle, with `filterChipVariants` exported for chip-shaped triggers), `SearchField`, and the `exportRowsToCsv` utility (`@nhic/currantui/lib/export-csv`). These are state-library-agnostic — pair them with TanStack Table (or anything else) using the copy-paste "Recipes/Rich Table" story in Storybook, which demonstrates the full worklist-style table end to end. Contrast fixes found by the a11y gate along the way: the selection bar's Clear button now uses `text-foreground/70`.
- 51f54e7: Make the palette WCAG AA compliant: light-mode `--primary` and `--destructive` darken to oklch L 0.52 (white-on-primary now 5.2:1, was 2.8:1; destructive-on-tint 5.2:1, was 4.0:1), and dark mode keeps the bright teal but switches `--primary-foreground` to dark ink (6.8:1). `HicLogo` gains `role="img"` so its `aria-label` is valid ARIA. Every Storybook story now passes an axe audit in CI.

### Patch Changes

- 51f54e7: Move the package to `packages/currantui` in the new pnpm workspace and point `repository.directory` at it; published output is unchanged.

## 0.2.0

### Minor Changes

- dbd78f3: Add PageHeader, ErrorPage, HicLogo, and SiteFooter components, plus the design-standards doc.

  - HicLogo: the Ministry of Health / Health Intelligence Center lockup (coat-of-arms image + bilingual-ready text + optional word stamp). The coat-of-arms SVG ships at `@nhic/currantui/assets/logo.svg`; the component defaults to `src="/logo.svg"`, so copy the asset to your public root or pass a bundler-imported URL.
  - SiteFooter: portal-style footer layout with no baked-in content — `columns`, `copyright`, `brandHref`, and `brandAria` are required props (i18n is the caller's concern). The brand slot defaults to HicLogo; external links (`http(s)` hrefs) open in a new tab automatically.
  - ErrorPage: tokenized (`bg-background`/`text-foreground`/`text-muted-foreground` instead of hard-coded white/black/gray) so it follows the active theme including dark mode; accepts a `logo` slot prop, now defaulting to HicLogo.
  - PageHeader: extracted from eRadia with a new `className` prop.
  - **Removed** the eRadia `logo` component (`@nhic/currantui/components/logo`) — HicLogo is the design system's brand mark. Apps wanting a product-specific logo keep it in their own repo and pass it via the `logo`/`brand` slots.

## 0.1.0

### Minor Changes

- Initial release
