# Step 1E GitHub and CI walkthrough

## Objective

Provide a reviewable GitHub workflow with reproducible local checks, restricted permissions, dependency maintenance, and an unambiguous final status.

## Repository controls

- `.github/workflows/ci.yml` separates repository, web-quality, test, build, and Python-service checks.
- The workflow has read-only repository permissions and disables persisted checkout credentials.
- `scripts/repository-guard.mjs` checks required paths, naming, lockfiles, generated output, nested repositories, and tracked local environment files.
- `scripts/ci-check.mjs` runs the local CI-equivalent sequence and stops on the first failure.
- Dependabot groups compatible npm, action, and Python-tool updates on a weekly schedule.
- The pull request template requires scope, security, environment, migration, test, documentation, risk, and rollback disclosure.

## Required local verification

```powershell
pnpm install --frozen-lockfile
pnpm ci:check
```

The GitHub `PlayToday CI` aggregation job must also pass on the exact release commit. Branch protection should require that final check after its name has been confirmed from a real pull-request run.

## Known administrative boundary

Repository files cannot prove that remote branch protection, reviewers, environments, or GitHub teams are configured. A repository administrator must apply and verify those settings in GitHub. CODEOWNERS must not be added until the real users or teams are known.
