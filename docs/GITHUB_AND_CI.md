# PlayToday GitHub and CI

## Pull request workflow

Changes are developed on a focused branch and reviewed through a pull request. The pull request must identify its roadmap scope, risks, migrations, environment changes, verification results, documentation changes, and rollback approach. Secrets and personal data must not appear in issues, commits, logs, screenshots, or reports.

## Required workflow

`.github/workflows/ci.yml` runs on pushes, pull requests, and manual dispatches with read-only repository permissions. It contains:

- Repository guard and example-environment validation.
- Web formatting, lint, and TypeScript checks.
- JavaScript, UI, and Python tests with coverage.
- Production builds.
- Per-service Python formatting, lint, and tests.
- A final aggregation job that fails unless every required dependency succeeds.

The local equivalent is:

```powershell
pnpm install --frozen-lockfile
pnpm ci:check
```

No failed required check may be skipped or reported as passing. Cache hits are acceptable, but generated output and foreign lockfiles are not committed.

## Supabase verification

Repository CI currently validates migration contracts statically. A release also requires a Docker-backed local Supabase reset and pgTAP execution. Remote deployment automation may use the Supabase GitHub integration or a separately reviewed CLI workflow. Neither option replaces local replay or migration-drift review.

## Dependency maintenance

Dependabot checks npm, GitHub Actions, and Python development tools weekly. Updates require the same test and review standard as any other change.
