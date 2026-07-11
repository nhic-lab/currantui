# CurrantUI — Development

## Local setup

```bash
git clone git@github.com:nhic-lab/currantui.git
cd currantui
pnpm install
pnpm build        # dist/ — ESM + d.ts + globals.css
pnpm typecheck
pnpm lint
```

Node ≥ 22 and pnpm 9.15.x (pinned via `packageManager`). There is no dev server in this repo; to see components render, `pnpm pack` and install the tarball into a scratch Vite app, or `pnpm link` from a consuming project.

`pnpm install` also wires `.githooks/` as the git hooks path (via the `prepare` script). The `pre-commit` hook scans staged content for supply-chain loader indicators (PolinRider-class config injections, script payloads disguised as fonts, `.vscode` auto-run persistence) and blocks the commit on a match.

## Environment variables

The package reads no environment variables at runtime. CI uses:

| Name | Required | Source | Controls |
|---|---|---|---|
| `GITHUB_TOKEN` | Provided by Actions | GitHub Actions | Changesets release PR + tag creation |

There is deliberately no npm token: publishing uses [OIDC trusted publishing](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/) (2FA-bypass granular tokens are deprecated — no direct publishing from January 2027). The publish job's `id-token: write` permission plus the trusted-publisher binding on npmjs.com replace any stored secret.

## Coding standards

- TypeScript strict; `pnpm typecheck` must pass. ESLint config is `@tanstack/eslint-config`; `pnpm lint` must pass (it enforces import sorting, top-level `import type`, and `Array<T>` syntax).
- Components follow shadcn conventions: one file per component in `src/components`, variants via `class-variance-authority`, class merging via `cn` from `@nhic/currantui/lib/utils`.
- Internal imports always use the `@nhic/currantui/*` alias, never relative paths across directories.
- Components reference design tokens (`bg-primary`, `border-border`, …) — never hard-coded colors.
- No app-specific logic (fetching, routing, auth) in components; slots and props only.
- New primitives preferably via `pnpm dlx shadcn@latest add <component>`, then adjusted to house style — house style is defined in [design-standards.md](design-standards.md) (shadcn defaults never match: density, type scale, icons, and focus recipe all need adaptation).

Review checklist:

- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm build` all pass
- [ ] New/changed component complies with [design-standards.md](design-standards.md) (tokens, density scale, focus/disabled/invalid recipe, Phosphor icons, cva variant vocabulary)
- [ ] Any new runtime dependency has an allow-listed license (MIT / BSD / Apache-2.0 / ISC / OFL-1.1 / 0BSD)
- [ ] `react`, `react-dom`, `tailwindcss` remain peerDependencies
- [ ] PR includes a changeset (`pnpm changeset`) if the published output changes

## Git workflow

- Branches: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, `chore/<topic>`.
- Commits: conventional style (`feat(button): …`, `fix(css): …`), signed.
- PRs target `master`; CI must be green; user-facing changes carry a changeset.

## Testing strategy

No unit test suite yet — the package is presentation-only and its highest-risk surface is the build/packaging contract, which CI covers via typecheck + lint + build. The pre-release bar for packaging changes: `pnpm pack`, install the tarball into a scratch Vite + Tailwind v4 app, and verify components render styled (this proves the `@source` scanning contract). Add Vitest + Testing Library when components gain behavior worth asserting (keyboard interaction, controlled state).

## Security

- No user data, no PHI, no telemetry — this package renders UI only. Compliance obligations: none directly; consuming apps (e.g. eRadia under HIPAA/GDPR/Rwanda Law 058) carry their own.
- Supply-chain posture matters because regulated apps consume this package: runtime deps must hold allow-listed licenses (eRadia's CI fails on banned licenses), dependency bumps arrive as weekly Dependabot PRs where CI builds them, and the `.githooks/pre-commit` hook blocks known malware-loader patterns (obfuscated config injections, fake font payloads, `.vscode` auto-run tasks) from being committed.
- Fonts are self-hosted via Fontsource — consumers make no external font/CDN requests because of this package.
- There are no stored publish credentials: npm publishing is OIDC trusted publishing, bound to `release.yml` + the `npm-publish` environment and gated by required-reviewer approval. Nothing is read from the environment at runtime.
