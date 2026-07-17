# CurrantUI — Design Standards

The rules every component in this package follows, extracted from the shipped code. `src/styles/globals.css` is canonical for token *values*; this document is canonical for token *usage*. A new component (hand-written or via `shadcn add`) is not done until it complies — shadcn defaults do **not** match house style and always need adaptation.

## Color

- Components reference semantic tokens only — `bg-primary`, `border-border`, `text-muted-foreground` — never palette utilities (`bg-white`, `text-gray-500`) or hex/oklch literals. Illustrations (inline SVG) are the one exception and should prefer `currentColor` driven by a token class.
- Token roles: `primary` (+ `primary-deep` for gradients) is brand/interactive emphasis; `secondary` is the filled-but-quiet variant; `muted` is de-emphasized surfaces and text; `accent` is hover/active surface tint; `destructive` is errors and dangerous actions; `success`/`warning`/`info` are the remaining status colors (confirmations, cautions, neutral notices); `card`/`popover` are raised surfaces; `border`/`input`/`ring` are edges and focus; `sidebar-*` scopes chrome (navbars, drawers, rails); `chart-1..5` are dataviz series.
- Status backgrounds (`destructive`, `success`, `warning`, `info`) use alpha tints of the token, not new colors: `bg-destructive/10` resting, `/20` hover (dark: `/20` → `/30`). Text on a tint is the base token itself (`text-success` on `bg-success/10`) — all four tokens are AA-checked for exactly this pairing in both palettes.
- Hover/active states shift alpha on the *same* token (`hover:bg-primary/80`), never introduce a different color.
- Every color token is defined twice — `:root` (light) and `.dark` — in oklch. A token missing its dark value is a defect.

## Dark mode

- Class-based: `.dark` on a root element via `@custom-variant dark (&:is(.dark *))`. Never key styling on `prefers-color-scheme`.
- NHIC products (radiology first) live in dark mode; design in dark, verify in light — not the reverse.

## Typography

- Single family: `--font-sans` and `--font-heading` both resolve to Source Sans 3 Variable. `font-heading` stays the semantic hook for headings and titles.
- Scale (productive dashboard ramp): default control/UI text is `text-sm/relaxed` (14px); floor is `text-xs` for meta/helper text; `text-2xs` exists only for size-constrained avatar internals (fallback initials, badges) and is never used generally. Arbitrary bracket font sizes are banned in component source (stories exempt), grep-checked, with the `hic-logo.tsx` brand lockup as the sole exception. Card/section titles are `text-base font-semibold tracking-tight` in `font-heading`; page titles are `text-xl font-semibold tracking-tight` in `font-heading`. Nothing in chrome exceeds `text-xl`. A few table surfaces intentionally sit off this scale: the table-toolbar search input and table-selection-bar Clear button are `text-xs`, and the table-empty-state body is `text-sm`, by design.
- Numeric/meta text (counts, timestamps, IDs) gets `tabular-nums`.

## Density and sizing

Compact by default — this is a data-dense product family:

| Height | Used by |
|---|---|
| `h-5` | xs buttons, badges |
| `h-6` | sm buttons |
| `h-7` | **default** buttons, inputs, selects |
| `h-8` | lg buttons, tabs lists, sub-navigation strips |

Horizontal padding `px-2` at default size, `gap-1` between icon and label. A shadcn component arriving with `h-9`/`h-10` controls must be brought down to this scale.

## Radius

`--radius` is 0.25rem (crisp, dashboard-style 4px on `rounded-lg` containers); the derived steps (`rounded-sm` ≈ 0.6×, `rounded-md` ≈ 0.8×, up to `4xl` ≈ 2.6×) come from `@theme inline`. Defaults: `rounded-md` for controls, `rounded-sm` for xs sizes, `rounded-lg` for grouped containers (tabs list), `rounded-full` for badges/pills. Never a literal `rounded-[Npx]`.

## Icons

- Phosphor (`@phosphor-icons/react`) only — no lucide, no heroicons, no ad-hoc SVG icons (illustrations excepted).
- Components size descendant icons via the `[&_svg:not([class*='size-'])]:size-*` pattern so callers can override with an explicit `size-*` class: `size-4` base, `size-3.5` in default buttons, `size-3` sm, `size-2.5` xs and badges.
- Icons are decorative by default: `pointer-events-none`, no labels — the accessible name comes from the control's text or `aria-label`.

## Interaction states (one recipe, everywhere)

- **Focus:** `focus-visible:border-ring` + `focus-visible:ring-2 focus-visible:ring-ring/30` (badges use `ring-[3px]`/`ring/50`). Never a CSS `outline`, never focus-invisible.
- **Disabled:** `disabled:pointer-events-none disabled:opacity-50`.
- **Invalid:** driven by `aria-invalid`, not custom props — `aria-invalid:border-destructive` + `aria-invalid:ring-2 aria-invalid:ring-destructive/20` (dark `/40`, border `/50`).
- **Press:** buttons nudge with `active:translate-y-px`.
- **Cursor:** enabled buttons get `cursor-pointer` (base layer handles this globally).
- **Transitions:** `transition-all` or `transition-colors` with default duration — no custom timing.

### React Aria Components state recipe

Components built on `react-aria-components` (dates, number field, tags, tree, drop zone, collections) express state through **data attributes**, not CSS pseudo-classes — RAC uses virtual focus in collections, so `focus-visible:`/`disabled:` selectors silently miss. Same visual recipe, different selectors:

- **Focus:** `data-[focus-visible]:border-ring data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30`
- **Disabled:** `data-[disabled]:pointer-events-none data-[disabled]:opacity-50`
- **Invalid:** `data-[invalid]:border-destructive data-[invalid]:ring-2 data-[invalid]:ring-destructive/20` (dark `/40`, border `/50`)
- Other states follow the same pattern: `data-[hovered]:`, `data-[pressed]:`, `data-[selected]:`, `data-[placeholder]:`, `data-[expanded]:`, `data-[drop-target]:`.

Plain string `className` with `cn(...)`/cva works on RAC components exactly as on Radix ones; do not use the `tailwindcss-react-aria-components` plugin — `globals.css` is published and a `@plugin` there would force the plugin on every consumer.

## Component authoring conventions

- One component per file in `src/components`; internal imports via the `@nhic/currantui/*` alias.
- Variants via `class-variance-authority`; class merging via `cn` (`clsx` + `tailwind-merge`). Extend native props with `React.ComponentProps<...>` and spread the rest.
- Shared variant vocabulary — reuse these names, don't invent new ones: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`. Status-bearing components (alerts, status lights, tags, notifications) may additionally use `success`, `warning`, `info` — the same names as the tokens, never synonyms like `positive` or `caution`.
- Structural attributes: `data-slot="<part>"` on each rendered part; `group/<component>` classes for parent-state styling; polymorphism via Radix `Slot` behind an `asChild` prop.
- Interactive behavior comes from Radix primitives (via the `radix-ui` package) — never re-implement dialogs, menus, tooltips, or switches from scratch.
- Composition over configuration: layout components expose slots (`leftSlot`, `rightSlot`, `children`), never fetch data, never know about routing, auth, or business rules.

## Accessibility

- Keyboard reachability and a visible focus ring on every interactive element are non-negotiable (see the focus recipe).
- Validation state is communicated with `aria-*` attributes so it reaches assistive tech, not just color.
- Color contrast: verify text-on-token combinations in **both** palettes when adding or changing a token.
