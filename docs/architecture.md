# CurrantUI — Architecture

## Tech stack

| Layer | Technology | Why chosen |
|---|---|---|
| UI runtime | React 19 (peer) | Matches all NHIC consumer stacks |
| Primitives | Radix UI (via `radix-ui`) + shadcn/ui conventions | Accessible headless primitives; shadcn CLI keeps the component set growable |
| Styling | Tailwind CSS v4 (peer) + CSS variable tokens | Consumers compose the tokens into their own Tailwind build; re-branding is a variable override |
| Variants | class-variance-authority + clsx + tailwind-merge | Standard shadcn variant stack |
| Icons | @phosphor-icons/react | Icon set already used across NHIC projects |
| Fonts | Source Sans 3 Variable (body), Geist Variable (headings) via Fontsource | Self-hosted, no external font CDN |
| Toasts | sonner | Ships as the `sonner.tsx` wrapper component |
| Build | tsup (esbuild) → ESM + `.d.ts` | Per-file entries with code splitting keep tree-shaking; fast |
| Versioning | Changesets | Semver + changelog + automated release PRs |
| Registry | npmjs.com, `nhic` org, public | GitHub Packages requires the scope to equal the GitHub org (`@nhic-lab`); the `@nhic` scope forces npmjs |

## System shape

```
nhic-lab/currantui (this repo)
  src/components/*.tsx ─┐
  src/lib/utils.ts     ─┼─ tsup ──► dist/**/*.js + *.d.ts  ("use client" banner)
  src/styles/globals.css ─ copied ─► dist/globals.css  (@source "./")
                                        │
                              changesets publish
                                        ▼
                            npmjs.com  @nhic/currantui
                                        │ pnpm add
        ┌───────────────────────────────┼───────────────────────────┐
        ▼                               ▼                           ▼
   TanStack Start apps          Next.js projects            future NHIC apps
```

## Package contract

- **Exports:** `./components/*`, `./lib/*`, `./hooks/*` (each with `types` + `import` conditions) and `./globals.css` → `dist/globals.css`.
- **CSS:** `globals.css` imports `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`, and the fonts, then defines all tokens (`:root` light, `.dark` dark, `@theme inline` mappings). Its `@source "./";` directive makes the consumer's Tailwind scan the compiled JS in `dist/`, which is what generates utilities for classes used inside components.
- **"use client":** the tsup banner stamps every output file so Next.js App Router consumers work without configuration.
- **Peers:** `react`, `react-dom` (^19) and `tailwindcss` (^4) are peerDependencies. Everything else the components need at runtime is a regular dependency and resolves transitively.
- **Internal imports** use the `@nhic/currantui/*` alias — resolved by tsconfig `paths` at build time, and by npm package self-reference in the emitted `.d.ts`.

## Design tokens (canonical list)

Tokens live in `src/styles/globals.css` and are the source of truth — components reference tokens, never raw colors. Families: `background`/`foreground`, `card`, `popover`, `primary` (+ `primary-deep`), `secondary`, `muted`, `accent`, `destructive`, `border`/`input`/`ring`, `chart-1..5`, `sidebar-*`, `radius` (with derived `sm..4xl` steps), `font-sans`, `font-heading`. Each color token has a light (`:root`) and dark (`.dark`) value in oklch.

## Integrations

### npmjs.com (publish target)
Public package under the `nhic` org. Publishing uses **npm trusted publishing (OIDC)** — no publish token exists anywhere — and, because the package is public, npm attaches **provenance attestations** to every CI release, cryptographically linking the published tarball to this repo, workflow, and commit. The package's npm settings name this repo's `release.yml` workflow and the `npm-publish` environment as the trusted publisher; npm mints a short-lived credential per workflow run, and only for runs a required reviewer has approved. This follows npm's deprecation of 2FA-bypass granular access tokens ([GitHub changelog, 2026-07-08](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/)): such tokens lose 2FA bypass for account operations in August 2026 and lose direct publishing entirely in January 2027, with trusted publishing as the recommended migration. Failure mode: a failed publish leaves the release PR open — rerun the workflow; Changesets is idempotent.

### GitHub Actions (CI/CD)
`ci.yml` runs install → typecheck → lint → build on every PR and push to `master`. `release.yml` is split into two jobs:

- **version** — runs on every `master` push with only `GITHUB_TOKEN`: opens/updates the Version Packages PR and checks whether the push bumped `package.json`'s version.
- **publish** — runs only when the version was bumped (a Version PR merge or deliberate manual bump), and targets the **`npm-publish` environment with required reviewers**: a human must approve the run before the job starts. The job carries `id-token: write` and publishes via OIDC trusted publishing — npm's short-lived credential can only be minted from an approved run of this workflow. Doc-only pushes never request approval; nothing can reach npm without a person signing off.

### shadcn CLI (development-time)
`components.json` maps the shadcn aliases to `@nhic/currantui/*`, so `pnpm dlx shadcn@latest add <component>` scaffolds new primitives directly into `src/components` with correct imports. The `shadcn` package is also a **runtime** dependency because `globals.css` imports `shadcn/tailwind.css`.

## Operations

**Infrastructure:** none beyond GitHub + npmjs — there is nothing deployed or hosted.

**Deployment pipeline:** PR (with changeset) → merge to `master` → Changesets release PR → merge → **human approval on the `npm-publish` environment** → OIDC publish + git tag. Secrets policy: **zero long-lived credentials** — publishing is OIDC trusted publishing bound to this workflow + environment, and the only token anywhere is the ephemeral `GITHUB_TOKEN` GitHub Actions provides.

**Monitoring:** not applicable; consumers surface issues via this repo's GitHub issues.
