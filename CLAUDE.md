# CurrantUI — Claude Navigation Guide

CurrantUI is NHIC's standalone React design system — shadcn/ui + Radix primitives with Tailwind v4 tokens, extracted from eRadia's `@workspace/ui` and published to npm as `@nhic/currantui` for every NHIC enterprise project.

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
| Fonts | Source Sans 3 Variable + Geist Variable (Fontsource) |
| Build | tsup → ESM + `.d.ts`, `"use client"` banner |
| Versioning | Changesets |
| Registry | npmjs.com, `nhic` org, public |

---

## Architecture

```
src/components/*.tsx ──┐
src/lib/utils.ts      ─┼─ tsup ──► dist/  (ESM + d.ts, "use client")
src/styles/globals.css ─ copied ─► dist/globals.css  (@source "./")
                            │ changesets publish (CI only)
                            ▼
                 npmjs  @nhic/currantui  ──► eRadia, Next.js apps, future NHIC apps
```

Consumer contract: `pnpm add @nhic/currantui`, then one CSS line — `@import "@nhic/currantui/globals.css";` — and imports like `@nhic/currantui/components/button`.

---

## Non-negotiable rules

1. **pnpm only.** Never `npm`, never `yarn`.
2. **`react`, `react-dom`, and `tailwindcss` are peerDependencies.** Moving them to `dependencies` duplicates React in consumers and breaks them.
3. **ESM only, and every `dist` file carries the `"use client"` banner** (tsup config). Removing the banner breaks Next.js App Router consumers.
4. **`src/styles/globals.css` is the canonical token source and consumer entry.** Its `@source "./";` directive must survive any edit — it is what makes consumer Tailwind builds scan the compiled components. It is copied verbatim to `dist/globals.css` by the build script.
5. **Internal imports use the `@nhic/currantui/*` alias** (tsconfig `paths` + shadcn `components.json`), never cross-directory relative paths.
6. **No app-specific logic in components** — no data fetching, routing, auth, or business rules; slots and props only.
7. **Runtime deps must hold allow-listed licenses** (MIT / BSD-2 / BSD-3 / Apache-2.0 / ISC / OFL-1.1 / 0BSD) — regulated consumers (eRadia) fail CI on banned licenses.
8. **Every change to published output ships with a changeset.** Publishing happens only in CI via Changesets behind the `npm-publish` environment's required-reviewer approval, using **OIDC trusted publishing** — never `npm publish` locally, and never a stored npm token (2FA-bypass granular tokens are deprecated; no direct publishing from January 2027).
9. **Registry is npmjs under the `nhic` org.** GitHub Packages cannot host this package (it requires the scope to equal the GitHub org, `@nhic-lab`).
10. **`shadcn` stays a regular dependency** — `globals.css` imports `shadcn/tailwind.css` at runtime; it is not just a CLI.

---

## Documentation map

| If you need to know... | Read... |
|---|---|
| Why this package exists, scope, non-goals | `docs/overview.md` |
| Stack, package contract, tokens, CI/CD | `docs/architecture.md` |
| Setup, standards, git workflow, testing, security | `docs/development.md` |
| The extraction design decisions | `docs/superpowers/specs/2026-07-10-currantui-extraction-design.md` (local only — `docs/superpowers/` is gitignored) |

---

## Key files

| Path | Purpose |
|---|---|
| `package.json` | Exports map, peer/runtime dep split, scripts |
| `tsup.config.ts` | Build: entries, splitting, dts, `"use client"` banner |
| `src/styles/globals.css` | Design tokens + Tailwind entry (canonical) |
| `src/components/` | One file per component, shadcn conventions |
| `src/lib/utils.ts` | `cn` helper |
| `components.json` | shadcn CLI config (aliases → `@nhic/currantui/*`) |
| `.changeset/` | Changesets config + pending changesets |
| `.github/workflows/` | `ci.yml` (verify) + `release.yml` (publish) |
| `.githooks/pre-commit` | Blocks PolinRider-class supply-chain loader patterns (wired by `prepare`) |

---

## Common commands

```bash
pnpm build        # tsup + globals.css copy → dist/
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint (@tanstack/eslint-config)
pnpm changeset    # add a changeset to the current PR
pnpm dlx shadcn@latest add <component>   # scaffold a new primitive
```
