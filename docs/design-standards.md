# CurrantUI — Design Standards

The rules every component in this package follows, extracted from the shipped code. `src/styles/globals.css` is canonical for token *values*; this document is canonical for token *usage*. A new component (hand-written or via `shadcn add`) is not done until it complies — shadcn defaults do **not** match house style and always need adaptation.

## Color

- Components reference semantic tokens only — `bg-primary`, `border-border`, `text-muted-foreground` — never palette utilities (`bg-white`, `text-gray-500`) or hex/oklch literals. Illustrations (inline SVG) are the one exception and should prefer `currentColor` driven by a token class.
- Token roles: `primary` (+ `primary-deep` for gradients) is brand/interactive emphasis; `secondary` is the filled-but-quiet variant; `muted` is de-emphasized surfaces and text; `accent` is hover/active surface tint; `destructive` is errors and dangerous actions; `card`/`popover` are raised surfaces; `border`/`input`/`ring` are edges and focus; `sidebar-*` scopes chrome (navbars, drawers, rails); `chart-1..5` are dataviz series.
- Destructive backgrounds use alpha tints of the token, not new colors: `bg-destructive/10` resting, `/20` hover (dark: `/20` → `/30`).
- Hover/active states shift alpha on the *same* token (`hover:bg-primary/80`), never introduce a different color.
- Every color token is defined twice — `:root` (light) and `.dark` — in oklch. A token missing its dark value is a defect.

## Dark mode

- Class-based: `.dark` on a root element via `@custom-variant dark (&:is(.dark *))`. Never key styling on `prefers-color-scheme`.
- NHIC products (radiology first) live in dark mode; design in dark, verify in light — not the reverse.

## Typography

- `--font-sans` = Source Sans 3 Variable: all body/UI text. `--font-heading` = Geist Variable (`font-heading`): headings and titles only.
- Scale: default control/UI text is `text-xs/relaxed`; floor is `text-[0.625rem]` (badges, xs buttons); page titles are `text-base font-semibold tracking-tight` in `font-heading`. Nothing in chrome exceeds `text-base`.
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

`--radius` is 0.625rem; the derived steps (`rounded-sm` ≈ 0.6×, `rounded-md` ≈ 0.8×, up to `4xl` ≈ 2.6×) come from `@theme inline`. Defaults: `rounded-md` for controls, `rounded-sm` for xs sizes, `rounded-lg` for grouped containers (tabs list), `rounded-full` for badges/pills. Never a literal `rounded-[Npx]`.

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

## Component authoring conventions

- One component per file in `src/components`; internal imports via the `@nhic/currantui/*` alias.
- Variants via `class-variance-authority`; class merging via `cn` (`clsx` + `tailwind-merge`). Extend native props with `React.ComponentProps<...>` and spread the rest.
- Shared variant vocabulary — reuse these names, don't invent new ones: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`.
- Structural attributes: `data-slot="<part>"` on each rendered part; `group/<component>` classes for parent-state styling; polymorphism via Radix `Slot` behind an `asChild` prop.
- Interactive behavior comes from Radix primitives (via the `radix-ui` package) — never re-implement dialogs, menus, tooltips, or switches from scratch.
- Composition over configuration: layout components expose slots (`leftSlot`, `rightSlot`, `children`), never fetch data, never know about routing, auth, or business rules.

## Accessibility

- Keyboard reachability and a visible focus ring on every interactive element are non-negotiable (see the focus recipe).
- Validation state is communicated with `aria-*` attributes so it reaches assistive tech, not just color.
- Color contrast: verify text-on-token combinations in **both** palettes when adding or changing a token.
