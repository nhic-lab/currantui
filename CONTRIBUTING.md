# Contributing

Thanks for choosing to contribute!

The following are a set of guidelines to follow when contributing to CurrantUI, the National Health Intelligence Center (NHIC) design system.

## Code of Conduct

This project adheres to the NHIC [code of conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [security.nhic@moh.gov.rw](mailto:security.nhic@moh.gov.rw).

## Reporting issues

### Bugs

We use [GitHub issues](https://github.com/nhic-lab/currantui/issues) to track work and log bugs. Please check existing issues before filing anything new. If you would like to contribute a fix, let us know by leaving a comment on the issue.

The best way to reduce back and forth on a bug is to provide a small code example exhibiting the issue along with steps to reproduce it — the affected `@nhic/currantui` version, the component, and what you expected to happen. If you would like to work on a bugfix yourself, make sure an issue exists first.

Please follow the issue templates when filing new ones and add as much information as possible.

### Component and feature requests

If you want to propose a new component, a new variant or prop on an existing component, or a token change, use the component/feature request issue template. Proposals are checked against the [design standards](./docs/design-standards.md) — new components must fit the token system, density scale, and accessibility bar before they are accepted, so describe the use case in the consuming NHIC application, not just the desired API.

### Security issues

Security issues must not be reported on the public issue tracker. Please follow our [security policy](./SECURITY.md): open a [private security advisory](https://github.com/nhic-lab/currantui/security/advisories/new) or email [security.nhic@moh.gov.rw](mailto:security.nhic@moh.gov.rw).

## Pull requests

For significant changes (new components, token changes, breaking API changes), it is recommended that you first open an issue and gather feedback before writing code.

A few things to keep in mind before submitting a pull request:

- Add a clear description covering your changes
- Reference the issue in the description
- Make sure `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `pnpm test` pass
- Add/update stories in Storybook for your changes
  - Any change that adds or modifies a component, variant, or prop must have stories representing that change, and every story must pass the axe accessibility gate
- Comply with the [design standards](./docs/design-standards.md) — tokens only (no hard-coded colors), the shared focus/disabled/invalid recipe, Phosphor icons, and the cva variant vocabulary
- Include a changeset (`pnpm changeset`) if the published output changes
- Keep `react`, `react-dom`, and `tailwindcss` as peerDependencies, and make sure any new runtime dependency holds an allow-listed license (MIT / BSD / Apache-2.0 / ISC / OFL-1.1 / 0BSD)
- Update documentation
- Remember that all submissions require review, please be patient

The full review checklist lives in [docs/development.md](./docs/development.md). The team will review all pull requests and do one of the following:

- request changes to it (most common)
- merge it
- close it with an explanation

Read GitHub's [pull request documentation](https://help.github.com/articles/about-pull-requests/) for more information on sending pull requests.

## Where to start

There are many ways to help out. Before you take on a feature or issue, make sure you become familiar with the [overview](./docs/overview.md), the [architecture](./docs/architecture.md), and the [design standards](./docs/design-standards.md).

If you are looking for a place to start, consider the following options:

- Look for issues tagged with `help wanted` and/or `good first issue`
- Help triage existing issues by investigating problems and following up on missing information
- Update missing or fix existing documentation
- Review and test open pull requests

## Developing

Make sure you have [Node.js](https://nodejs.org/) v22+ and [pnpm](https://pnpm.io/) 9.15.x installed (the exact pnpm version is pinned via `packageManager` in the root manifest). Never use npm or yarn in this repo.

Fork the repo first using [this guide](https://help.github.com/articles/fork-a-repo), then clone it locally:

```
git clone git@github.com:YOUR-USERNAME/currantui.git
cd currantui
pnpm install
```

The repo is a pnpm workspace: the published package lives in `packages/currantui`, and `apps/storybook` is the dev workbench — every component is developed and reviewed against its co-located stories.

You can then run Storybook and browse to http://localhost:6006 with:

```
pnpm storybook
```

### Tests

Every story doubles as a test: `pnpm test` runs Vitest in browser mode (Playwright Chromium) through the Storybook vitest addon — each story must render without error and pass an axe accessibility audit. Interactive flows (dialog open, select pick, tab switch) are asserted with `play` functions on the story.

One-time setup for the test browser:

```
pnpm --filter @nhic/storybook exec playwright install chromium
```

To run all tests once, run:

```
pnpm test
```

The a11y gate is never weakened globally; a per-story rule scope-out requires a justifying comment. If you are curious about the best way to write a `play` function for an interaction, start by referencing existing stories that test similar things.

### Linting and type checking

The code is linted with eslint and type-checked with TypeScript in strict mode:

```
pnpm lint
pnpm typecheck
```

### Storybook

We use Storybook for local development, documentation, and as the test harness. Each new feature should have dedicated stories added to Storybook to demonstrate that feature, covering its variants, sizes, and states. Stories never reach the published `dist/` output.

## Releasing

Contributors never publish. Versioning is managed with [Changesets](https://github.com/changesets/changesets): your PR carries a changeset describing the change, and publishing to npm happens only in CI behind a required-reviewer approval. Never run `npm publish` locally.
