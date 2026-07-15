# @nhic/currantui

## 0.4.0

### Minor Changes

- acfdbc9: `ActionBar` — floating bulk-actions bar for any selectable collection (ListView, CardView, TreeView, tables): appears when items are selected with a live count, action slot, and a clear-selection button, overlaying the bottom of the wrapping container. TableSelectionBar remains the attached banner for tables.
- acfdbc9: Richer cards and a status indicator:

  - `CardCover` — full-bleed media area for the top of a Card (image, token gradient, or any visual); the card stories show cover, profile (overlapping avatar), and stat anatomies.
  - `StatusLight` — colored dot + label for states that aren't counts or alerts (published, available, offline…), with the status variant vocabulary plus `muted`.
  - `CardViewItem` is now unpadded so covers bleed edge-to-edge — compose `CardCover` + a padded body inside items.

- acfdbc9: Collection views:

  - `ListView` + `ListViewItem` — keyboard-navigable row collection with single/multiple selection, disabled items, and `renderEmptyState`; selection boxes reuse the Checkbox visual recipe (new `checkboxBoxClasses` export).
  - `CardView` + `CardViewItem` — card grid with two-dimensional keyboard navigation and the same selection model.
  - `TreeView` + `TreeViewItem` — hierarchical list with expandable branches (rotating chevron, level indentation), selection, and disabled branches.

- 4b47733: Command palette and searchable combobox (adds the `cmdk` runtime dependency, MIT):

  - `Command` family (`Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandShortcut`, `CommandSeparator`) — filterable command list, inline or as a palette dialog on the house Dialog.
  - `Combobox` — searchable single-select over a typed `options` array with controlled/uncontrolled value, disabled options, empty state, and `filter`/`shouldFilter` passthrough. Plain Select stays the default for short known lists; async/multi-select remain app-side compositions.

- ceb788f: `DatePicker` and `DateRangePicker` — segmented editable inputs with a calendar popover on the shared glass surface. Both compose the existing field chrome and Calendar/RangeCalendar, with optional built-in label and description, min/max bounds, and invalid/disabled states; range values render as one continuous bar in the popover calendar.
- 07ad0da: Date and time foundation (adds `react-aria-components` + `@internationalized/date`, both Apache-2.0):

  - `@nhic/currantui/lib/date` — the sanctioned import point for date/time value types (`CalendarDate`, `Time`, `parseDate`, `today`, …) so consumers never install a second copy of the underlying library.
  - `Calendar` and `RangeCalendar` — month grids at house density (size-7 cells, tabular numerals, today ring), with min/max and unavailable-date support; the range selection renders as one continuous bar.
  - `DateField` and `TimeField` — segmented, keyboard-editable inputs on the standard field chrome, with optional built-in label and description, invalid/disabled states, hour-cycle and granularity options.

- 3ea4070: Nine form-control and grouping components:

  - `Field` family (`Field`, `FieldLabel`, `FieldContent`, `FieldTitle`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldSet`, `FieldLegend`, `FieldSeparator`) — dependency-free label/description/error wiring around any control; grouped checkboxes/radios via FieldSet + FieldLegend.
  - `RadioGroup` + `RadioGroupItem` on the checkbox size/focus recipe.
  - `Slider` with multi-thumb range support and a `thumbLabels` prop for per-thumb accessible names.
  - `Toggle` + `ToggleGroup` (single/multiple, outline variant, attached `spacing={0}` mode).
  - `SegmentedControl` — single-select view switcher styled like the tabs list; the active option can't be deselected.
  - `Meter` — static `role="meter"` measurement with status-token variants, distinct from Progress.
  - `ButtonGroup` (+ `ButtonGroupText`, `ButtonGroupSeparator`) for attached/split buttons and input compositions.
  - `Pagination` family for general page navigation (data tables keep `TablePagination`).

- 59fa553: Help and AI affordances:

  - `Toggletip` family — click-triggered information bubble (works on touch, holds links and rich content, stays open until dismissed), with trigger/content/title/body parts and a ghost icon-button trigger by default
  - `ContextualHelp` — toggletip preset for explaining a nearby field or heading: info or question icon opening a titled help bubble
  - `AiLabel` — badge marking AI-generated content whose toggletip body (provenance, model, limitations) is fully caller-supplied

- 0f4d47a: Six new overlay and disclosure components:

  - `Popover` family (`Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`, `PopoverHeader`, `PopoverTitle`, `PopoverDescription`) sharing the Select/DropdownMenu glass surface treatment.
  - `DropdownMenu` family (content, items with `variant="destructive"`, checkbox/radio items, sub-menus, labels, separators, shortcuts) — covers Spectrum Menu/ActionMenu/MenuButton and Carbon OverflowMenu.
  - `Sheet` family (side panels from top/right/bottom/left) following the Dialog overlay conventions.
  - `Accordion` family (contained style, single or multiple expansion).
  - `Collapsible` (thin Radix wrapper for disclosure patterns).
  - `Alert` family with `default | destructive | success | warning | info` variants — the first consumer of the status tokens, plus an `AlertAction` slot.

- 33863f1: Six presentational components:

  - `InlineLoading` — spinner-plus-text feedback for short inline operations, announced as a live region (loading/success/error)
  - `Stepper` + `StepperItem` — multi-step progress indicator with horizontal and vertical orientations, complete/current/invalid/disabled step states, and `aria-current="step"`
  - `CodeSnippet` + `CodeSnippetInline` — monochrome code block with copy button and optional expand/collapse, plus an inline code pill for prose
  - `StructuredList` family — lightweight read-only rows for reference content, `default` and `contained` variants
  - `SelectBoxGroup` + `SelectBoxGroupItem` (+ title/description slots) — selectable cards with radio semantics (`type="single"`) or checkbox semantics (`type="multiple"`)
  - `EmptyState` — centered placeholder with icon/title/description/actions slots for views with nothing to show

- 860c481: Add `ProgressCircle` — a determinate ring for known completion and an indeterminate spinner when `value` is nullish, colored by `currentColor` (brand primary by default) with `sm`/`default`/`lg` sizes.

  `Loader` and `LoaderOverlay` now delegate to it (same API and pixel sizes, new ring visual) and `Loader` is deprecated — migrate to `ProgressCircle`; removal planned for the next major. Toast loading spinners and the file uploader's in-flight rows use it as well.

- 2b59e71: Add `Progress` (Radix) — determinate bar on the primary token with an RTL-safe width-based indicator, plus an indeterminate pulse state when `value` is null.
- 860c481: Numeric, tag, and file input components:

  - `NumberField` — locale-aware numeric input with stacked stepper buttons; `formatOptions` covers decimals, percent, currency, and units, plus min/max/step.
  - `TagGroup` + `Tag` — keyboard-navigable tag collection with removal (`onRemove`) and single/multiple selection; Badge stays the static chip, FilterChip the filter-bar affordance.
  - `DropZone` + `FileTrigger` — file drop target with highlighted drop state and an outline-button browse trigger.
  - `FileUploader` — drop zone + browse + file list composition with per-file `uploading | complete | error` status, progress, sizes, and remove buttons; the app owns the network and reports state back through `items`.

- 2b59e71: Spectrum-style toasts: `toast.info/success/warning/error` now render a custom toast matching React Spectrum's Toast anatomy — solid status-token fill, filled status icon, title + optional description, outlined action button, divider, and close button, with `--background` as the ink (the AA-checked inverted pairing in both palettes). The API is unchanged (drop-in sonner signatures, including `{ description, action: { label, onClick } }`); neutral `toast()`, `toast.loading`, and `toast.promise` keep the glass popover treatment.
- 6e3a6b9: Add `success`, `warning`, and `info` status color tokens to `globals.css` (light + dark, WCAG AA-checked against their alpha-tint backgrounds) with `@theme inline` mappings, so `bg-success/10`, `text-warning`, `border-info/30`, etc. work in consumers. They join `destructive` under one status recipe: token as text, alpha tints of the same token as background.
- ad4727c: Nine new structural components, all styled to house density/tokens and exported as `@nhic/currantui/components/<name>`:

  - `Card` family (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`) with `size="default" | "sm"`.
  - `Avatar` family (`Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount`) with `xs`/`sm`/`default`/`lg` sizes on the standard height scale.
  - `Skeleton` loading placeholder.
  - `Label` form label (Radix), pairs with inputs via `htmlFor`/`peer`.
  - `Textarea` matching the `Input` chrome (auto-growing via `field-sizing-content`).
  - `Breadcrumb` family (`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`) with RTL-aware separators.
  - `Link` inline text link with `asChild` for router integration.
  - `LabeledValue` label/value pair with vertical and horizontal orientations.

- 2b59e71: Carbon-style UI Shell — a ready-made application chassis so apps stop rewriting navbar/sidebar code:

  - `ShellProvider` + `useShell()` own the layout grid and state (side-nav collapse with cookie persistence and Mod+B, exclusive right panels, mobile detection); `ShellContent` and `ShellSkipToContent` complete the frame.
  - `ShellHeader` family: `ShellHeaderMenuButton`, `ShellHeaderName`, `ShellHeaderNav(Link/Menu/MenuItem)`, `ShellGlobalBar`, `ShellGlobalAction` (tooltip + optional `panelId` wiring).
  - `ShellSideNav` with `expandable` (hamburger-controlled, mobile overlay sheet below `lg`), `rail` (3rem icon rail expanding on hover/focus), and `fixed` variants; `ShellSideNavItems/Link/Menu/MenuItem/Divider/Footer`.
  - `ShellPanel` non-modal right panels + `ShellSwitcher(Item/Divider)` product switcher.
  - New `useIsMobile` hook exported at `@nhic/currantui/hooks/use-mobile`.
  - `Navbar` and `SidebarItem` are deprecated (still exported) — migrate to `ShellHeader` / `ShellSideNavLink`; removal planned for the next major.

  All links take `asChild` + `isActive` for router integration; chrome uses the `sidebar-*` tokens; dimensions are themable via CSS variables on the provider.

### Patch Changes

- 344005d: Neutral wording in component descriptions and source comments — no behavior changes.

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
