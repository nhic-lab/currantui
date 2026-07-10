# CurrantUI

NHIC's React design system: shadcn/ui + Radix primitives with Tailwind v4 tokens, published as `@nhic/currantui`.

## Requirements

- React 19
- Tailwind CSS v4
- pnpm

## Install

```bash
pnpm add @nhic/currantui
```

The package is public on npmjs.com under the `nhic` org — no registry auth needed to install.

## Setup

Import the design system in your CSS entry (it already imports `tailwindcss`, the shadcn base layer, and the fonts):

```css
@import "@nhic/currantui/globals.css";
```

Tailwind picks up your own app files through automatic content detection; the packaged `globals.css` carries an `@source` directive so classes used inside CurrantUI components are generated too.

## Usage

```tsx
import { Button } from "@nhic/currantui/components/button"
import { cn } from "@nhic/currantui/lib/utils"

export function Example() {
  return <Button variant="outline">Save</Button>
}
```

Dark mode is class-based: toggle the `dark` class on a root element (see `theme-toggle`).

## Theming

The default theme is the eRadia radiology look. Re-brand a project by overriding the CSS variables after the import:

```css
@import "@nhic/currantui/globals.css";

:root {
  --primary: oklch(0.55 0.15 150);
  --primary-deep: oklch(0.35 0.12 150);
  --radius: 0.5rem;
}
```

All tokens live in `src/styles/globals.css` (`:root` for light, `.dark` for dark).

## Adding components

The repo is shadcn-compatible. From the repo root:

```bash
pnpm dlx shadcn@latest add <component>
```

Generated files land in `src/components` with `@nhic/currantui/*` imports.

## Development

```bash
pnpm install
pnpm build        # tsup → dist (ESM + d.ts) + globals.css copy
pnpm typecheck
pnpm lint
```

## Documentation

| Doc | Contents |
|---|---|
| [docs/overview.md](docs/overview.md) | Problem, solution, users, non-goals |
| [docs/architecture.md](docs/architecture.md) | Stack, package contract, tokens, integrations, CI/CD |
| [docs/development.md](docs/development.md) | Setup, standards, git workflow, testing, security |
| [CLAUDE.md](CLAUDE.md) | AI navigation guide + non-negotiable rules |

## Releasing

Versioning is handled by [Changesets](https://github.com/changesets/changesets). Add a changeset to your PR:

```bash
pnpm changeset
```

Merging to `master` opens (or updates) a release PR. Merging that release PR triggers the publish job, which waits for **human approval on the `npm-publish` GitHub environment** before it runs. Publishing itself uses [npm trusted publishing (OIDC)](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/) — no npm token is stored anywhere; npm mints a short-lived credential only for approved runs of this workflow. (2FA-bypass granular tokens are deprecated and lose direct publishing in January 2027.)

## Community

Contributions are governed by the [Code of Conduct](CODE_OF_CONDUCT.md). Report vulnerabilities privately per the [Security Policy](SECURITY.md) — never via public issues.

## License

Apache-2.0 — see [LICENSE](LICENSE).
