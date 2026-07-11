# CurrantUI — Development

## Local setup

```bash
git clone git@github.com:nhic-lab/currantui.git
cd currantui
pnpm install
pnpm storybook    # dev workbench at http://localhost:6006
pnpm build        # packages/currantui/dist — ESM + d.ts + globals.css
pnpm typecheck
pnpm lint
pnpm test         # story render + axe a11y tests (needs Playwright Chromium, see below)
```

Node ≥ 22 and pnpm 9.15.x (pinned via `packageManager` in the root manifest). The repo is a pnpm workspace: the published package lives in `packages/currantui`, and `apps/storybook` is the dev environment — every component is developed and reviewed against its co-located stories. One-time test setup: `pnpm --filter @nhic/storybook exec playwright install chromium`.

`pnpm install` also wires `.githooks/` as the git hooks path (via the `prepare` script). The `pre-commit` hook scans staged content for supply-chain loader indicators (PolinRider-class config injections, script payloads disguised as fonts, `.vscode` auto-run persistence) and blocks the commit on a match.

## Environment variables

The package reads no environment variables at runtime. CI uses:

| Name | Required | Source | Controls |
|---|---|---|---|
| `GITHUB_TOKEN` | Provided by Actions | GitHub Actions | Changesets release PR + tag creation |

There is deliberately no npm token: publishing uses [OIDC trusted publishing](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/) (2FA-bypass granular tokens are deprecated — no direct publishing from January 2027). The publish job's `id-token: write` permission plus the trusted-publisher binding on npmjs.com replace any stored secret.

## Coding standards

- TypeScript strict; `pnpm typecheck` must pass. ESLint config is `@tanstack/eslint-config`; `pnpm lint` must pass (it enforces import sorting, top-level `import type`, and `Array<T>` syntax).
- Components follow shadcn conventions: one file per component in `packages/currantui/src/components`, variants via `class-variance-authority`, class merging via `cn` from `@nhic/currantui/lib/utils`.
- Every component ships with a co-located `<name>.stories.tsx` (CSF3, `satisfies Meta`) covering its variants, sizes, and states; stories are excluded from the published build.
- Internal imports always use the `@nhic/currantui/*` alias, never relative paths across directories.
- Components reference design tokens (`bg-primary`, `border-border`, …) — never hard-coded colors.
- No app-specific logic (fetching, routing, auth) in components; slots and props only.
- New primitives preferably via `pnpm dlx shadcn@latest add <component>`, then adjusted to house style — house style is defined in [design-standards.md](design-standards.md) (shadcn defaults never match: density, type scale, icons, and focus recipe all need adaptation).

Review checklist:

- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test` all pass
- [ ] New/changed component has stories covering its variants and states, and they pass the axe a11y gate
- [ ] New/changed component complies with [design-standards.md](design-standards.md) (tokens, density scale, focus/disabled/invalid recipe, Phosphor icons, cva variant vocabulary)
- [ ] Any new runtime dependency has an allow-listed license (MIT / BSD / Apache-2.0 / ISC / OFL-1.1 / 0BSD)
- [ ] `react`, `react-dom`, `tailwindcss` remain peerDependencies
- [ ] PR includes a changeset (`pnpm changeset`) if the published output changes

## Git workflow

- Branches: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, `chore/<topic>`.
- Commits: conventional style (`feat(button): …`, `fix(css): …`), signed.
- PRs target `master`; CI must be green; user-facing changes carry a changeset.

## Testing strategy

Every story doubles as a test: `pnpm test` runs Vitest 3 in browser mode (Playwright Chromium) through the Storybook vitest addon — each story must render without error and pass an axe accessibility audit (`a11y.test: "error"`). Interactive flows (dialog open, select pick, tab switch, menu open) are asserted with `play` functions. The a11y gate is never weakened globally; a per-story rule scope-out requires a justifying comment.

The build/packaging contract remains covered by CI (typecheck + lint + build + a guard that no story artifacts reach `dist/`). The pre-release bar for packaging changes is unchanged: `pnpm pack` from `packages/currantui`, install the tarball into a scratch Vite + Tailwind v4 app, and verify components render styled (this proves the `@source` scanning contract).

## Security

- No user data, no PHI, no telemetry — this package renders UI only. Compliance obligations: none directly; consuming apps (some operating under HIPAA/GDPR/Rwanda Law 058) carry their own.
- Supply-chain posture matters because regulated apps consume this package: runtime deps must hold allow-listed licenses (regulated consumers fail CI on banned licenses), dependency bumps arrive as weekly Dependabot PRs where CI builds them, and the `.githooks/pre-commit` hook blocks known malware-loader patterns (obfuscated config injections, fake font payloads, `.vscode` auto-run tasks) from being committed.
- Fonts are self-hosted via Fontsource — consumers make no external font/CDN requests because of this package.
- There are no stored publish credentials: npm publishing is OIDC trusted publishing, bound to `release.yml` + the `npm-publish` environment and gated by required-reviewer approval. Nothing is read from the environment at runtime.
