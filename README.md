# CurrantUI Workspace

pnpm workspace for the National Health Intelligence Center (NHIC) design system.

| Path | What it is |
|---|---|
| [`packages/currantui`](packages/currantui) | `@nhic/currantui` — the published React design system (shadcn/ui + Radix + Tailwind v4 tokens) |
| [`apps/storybook`](apps/storybook) | Private Storybook app: component workbench, docs site, and a11y test harness |

Future packages (e.g. charts) land under `packages/*` and are picked up by Storybook automatically.

## Commands (repo root)

```bash
pnpm install
pnpm storybook        # dev workbench at http://localhost:6006
pnpm build            # build @nhic/currantui → packages/currantui/dist
pnpm test             # story render + a11y tests (Vitest browser mode)
pnpm typecheck && pnpm lint
pnpm build-storybook  # static docs site
pnpm changeset        # add a changeset to your PR
```

## Documentation

| Doc | Contents |
|---|---|
| [docs/overview.md](docs/overview.md) | Problem, solution, users, non-goals |
| [docs/design-standards.md](docs/design-standards.md) | Tokens, typography, density, states |
| [docs/architecture.md](docs/architecture.md) | Stack, package contract, CI/CD |
| [docs/development.md](docs/development.md) | Setup, standards, git workflow, testing, security |
| [packages/currantui/README.md](packages/currantui/README.md) | Consumer install and usage guide |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to file issues and send pull requests |

## Releasing

Versioning via [Changesets](https://github.com/changesets/changesets); publishing happens only in CI behind the `npm-publish` environment using npm trusted publishing (OIDC). See the package README for details.

## License

Apache-2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE). Copyright © 2026 National Health Intelligence Center (NHIC), Ministry of Health, Rwanda.
