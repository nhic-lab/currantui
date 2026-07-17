# CurrantUI — Claude Navigation Guide

CurrantUI is the National Health Intelligence Center (NHIC) standalone React design system — shadcn/ui + Radix primitives with Tailwind v4 tokens, published to npm as `@nhic/currantui` for every NHIC enterprise project.

The repo is a pnpm workspace: `packages/currantui` is the published package, `apps/storybook` is the private Storybook workbench/docs/test app. Future packages (charts) land under `packages/*` and Storybook picks their stories up automatically.

---

## Package manager

**pnpm** (9.15.x) only. Never `npm`, never `yarn`.

---

## Tech stack (quick reference)

| Layer | Technology |
|---|---|
| UI runtime | React 19 (peerDependency) |
| Primitives | Radix UI (`radix-ui`) + shadcn/ui conventions |
| Styling | Tailwind CSS v4 (peerDependency) + CSS variable tokens |
| Variants | class-variance-authority + clsx + tailwind-merge |
| Icons | @phosphor-icons/react |
| Fonts | Source Sans 3 Variable (Fontsource) — single family |
| Build | tsup → ESM + `.d.ts`, `"use client"` banner |
| Workbench | Storybook 9 (react-vite) in `apps/storybook`, deployed to GitHub Pages |
| Testing | Vitest 3 browser mode (Playwright Chromium) — every story renders + passes axe |
| Versioning | Changesets |
| Registry | npmjs.com, `nhic` org, public |

---

## Architecture

```
packages/currantui/src/components/*.tsx ──┐
packages/currantui/src/lib/utils.ts      ─┼─ tsup ──► dist/  (ESM + d.ts, "use client")
packages/currantui/src/styles/globals.css ─ copied ─► dist/globals.css  (@source "./")
                            │ changesets publish (CI only)
                            ▼
                 npmjs  @nhic/currantui  ──► NHIC enterprise apps (Vite, Next.js, ...)

apps/storybook  ── aggregates packages/*/src/**/*.stories.tsx ──► dev workbench,
                   GitHub Pages docs site, and Vitest browser/a11y test harness
```

Consumer contract: `pnpm add @nhic/currantui`, then one CSS line — `@import "@nhic/currantui/globals.css";` — and imports like `@nhic/currantui/components/button`.

---

## Non-negotiable rules

1. **pnpm only.** Never `npm`, never `yarn`.
2. **`react`, `react-dom`, and `tailwindcss` are peerDependencies.** Moving them to `dependencies` duplicates React in consumers and breaks them.
3. **ESM only, and every `dist` file carries the `"use client"` banner** (tsup config). Removing the banner breaks Next.js App Router consumers.
4. **`packages/currantui/src/styles/globals.css` is the canonical token source and consumer entry.** Its `@source "./";` directive must survive any edit — it is what makes consumer Tailwind builds scan the compiled components. It is copied verbatim to `dist/globals.css` by the build script. The Storybook app imports it unmodified via its own `preview.css` wrapper.
5. **Internal imports use the `@nhic/currantui/*` alias** (tsconfig `paths` + shadcn `components.json`), never cross-directory relative paths.
6. **No app-specific logic in components** — no data fetching, routing, auth, or business rules; slots and props only.
7. **Runtime deps must hold allow-listed licenses** (MIT / BSD-2 / BSD-3 / Apache-2.0 / ISC / OFL-1.1 / 0BSD) — regulated consumers fail CI on banned licenses.
8. **Every change to published output ships with a changeset.** Publishing happens only in CI via Changesets behind the `npm-publish` environment's required-reviewer approval, using **OIDC trusted publishing** — never `npm publish` locally, and never a stored npm token (2FA-bypass granular tokens are deprecated; no direct publishing from January 2027).
9. **Registry is npmjs under the `nhic` org.** GitHub Packages cannot host this package (it requires the scope to equal the GitHub org, `@nhic-lab`).
10. **`shadcn` stays a regular dependency** — `globals.css` imports `shadcn/tailwind.css` at runtime; it is not just a CLI.
11. **Every component ships with a co-located `*.stories.tsx`** covering its variants/sizes/states. Stories never reach `dist/` (tsup negated glob + CI guard). Every story must pass the axe a11y gate (`a11y.test: "error"`) — never weaken the gate globally; per-story rule scope-outs need a justifying comment.
12. **`packageManager` and `pnpm.overrides` live only in the root `package.json`** — pnpm ignores them elsewhere, and the esbuild security floor silently stops applying if they move.

---

## Documentation map

| If you need to know... | Read... |
|---|---|
| Why this package exists, scope, non-goals | `docs/overview.md` |
| The design standards every component must follow | `docs/design-standards.md` |
| Stack, package contract, tokens, CI/CD | `docs/architecture.md` |
| Setup, standards, git workflow, testing, security | `docs/development.md` |
| The extraction design decisions | `docs/superpowers/specs/2026-07-10-currantui-extraction-design.md` (local only — `docs/superpowers/` is gitignored) |

---

## Key files

| Path | Purpose |
|---|---|
| `package.json` | Root workspace: scripts, `packageManager`, `pnpm.overrides`, shared devDeps |
| `pnpm-workspace.yaml` | Workspace globs (`packages/*`, `apps/*`) |
| `packages/currantui/package.json` | Exports map, peer/runtime dep split, build script |
| `packages/currantui/tsup.config.ts` | Build: entries (stories excluded), splitting, dts, `"use client"` banner |
| `packages/currantui/src/styles/globals.css` | Design tokens + Tailwind entry (canonical) |
| `packages/currantui/src/components/` | One file per component + co-located `*.stories.tsx` |
| `packages/currantui/src/lib/utils.ts` | `cn` helper |
| `packages/currantui/components.json` | shadcn CLI config (aliases → `@nhic/currantui/*`) |
| `apps/storybook/.storybook/` | Storybook config: main.ts, preview.tsx/css, manager.ts + nhic-theme.ts (NHIC branding), vitest.setup.ts |
| `apps/storybook/docs/` | Welcome cover page + Foundation MDX pages (Getting Started, Colors, Typography, Design Standards) |
| `apps/storybook/public/nhic-brand.svg` | Sidebar brand lockup (generated: emblem data-URI + wordmark) |
| `.changeset/` | Changesets config (`@nhic/storybook` ignored) + pending changesets |
| `.github/workflows/` | `ci.yml` (verify/test/build-storybook) + `release.yml` (publish) + `deploy-storybook.yml` (Pages) |
| `.githooks/pre-commit` | Blocks PolinRider-class supply-chain loader patterns (wired by root `prepare`) |

---

## Common commands

```bash
pnpm storybook       # dev workbench at http://localhost:6006
pnpm build           # tsup + globals.css copy → packages/currantui/dist
pnpm test            # story render + axe a11y tests (Vitest browser mode)
pnpm typecheck       # tsc --noEmit in every workspace package
pnpm lint            # eslint (@tanstack/eslint-config + storybook plugin)
pnpm build-storybook # static docs site → apps/storybook/storybook-static
pnpm changeset       # add a changeset to the current PR
cd packages/currantui && pnpm dlx shadcn@latest add <component>   # scaffold a new primitive
```

One-time local setup for tests: `pnpm --filter @nhic/storybook exec playwright install chromium`.
