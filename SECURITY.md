# Security Policy

We take security seriously at the National Health Intelligence Center (NHIC) and appreciate the efforts of security researchers who help keep our users safe.

## Reporting a Vulnerability

If you believe you've found a security vulnerability in CurrantUI or any NHIC project, please follow responsible disclosure practices and **do not** open a public GitHub issue, as this could expose the vulnerability before a fix is available.

Instead, please report it through one of the following channels:

- **GitHub Security Advisory:** [Open a private advisory](https://github.com/nhic-lab/currantui/security/advisories/new) on this repository.
- **Email:** [security.nhic@moh.gov.rw](mailto:security.nhic@moh.gov.rw)

We will acknowledge your report promptly and work with you to understand and resolve the issue as quickly as possible.

## Supply-chain integrity

- Releases are published from CI only, via [npm trusted publishing (OIDC)](https://docs.npmjs.com/trusted-publishers) behind a required-reviewer approval gate — no long-lived publish tokens exist.
- Public releases carry npm **provenance attestations** linking each tarball to the exact repo, workflow, and commit that produced it: verify with `npm audit signatures`.
- Dependency updates arrive as weekly Dependabot PRs and are built by CI before merge.
