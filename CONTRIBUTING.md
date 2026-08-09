# Contributing to PlayToday

PlayToday is a foundation-stage sports-intelligence project. It is not a bookmaker, does not place bets, and does not promise outcomes.

## Controlled workflow

Work on exactly one authorized roadmap step. Publish the step's complete visible walkthrough plan before commands or changes, provide progress updates after major groups, and finish with a permanent walkthrough and completion report. Do not pull future features forward or mix unrelated refactors into a narrow step.

Use branches such as `feature/`, `fix/`, `docs/`, `chore/`, or `security/` followed by a short description. Keep commits focused and describe intent and verification plainly; no commit-message convention is mechanically enforced.

## Local setup

Requirements are Node.js 22.16.0, pnpm 10.28.2 through Corepack or an equivalent exact installation, and Python 3.12+. pnpm is the only JavaScript package manager.

```powershell
corepack enable
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm env:check
pnpm ci:check
```

The example contains only non-secret values. Never commit `.env.local`; never paste environment values into reports.

## Pull requests and verification

Open a pull request using the repository template. Identify one roadmap step, state scope and exclusions, list files and documentation, disclose environment or migration changes, report exact test results, include redacted UI evidence when relevant, and supply risks and rollback steps. Run `pnpm ci:check` before completion. Required failures must never be bypassed, suppressed, or represented as passing.

Update the walkthrough, roadmap, changelog, decisions, and permanent rules when the change affects them. Update CI whenever a quality command changes.

## Security, data, AI, and product rules

- Never commit secrets, credentials, access tokens, payment data, or sensitive user information. Follow `SECURITY.md` for private disclosure.
- Preserve source provenance, timestamps, versions, failures, corrections, exclusions, and auditability. Never fabricate fixtures, odds, results, probabilities, booking codes, or provider support; never hide failed predictions.
- AI may not invent authoritative sports facts or outcomes. Future AI work requires grounded, allowlisted data access and explicit uncertainty.
- Do not scrape bookmakers or claim official integration/booking-code support without written authorization and a verified contract.
- Use responsible-play language. Never promise guaranteed wins, encourage chasing losses, or implement loss-recovery/martingale behavior.
- Do not introduce unrelated refactors, deployments, external integrations, or future-phase functionality inside a controlled step.

By contributing, you agree to `CODE_OF_CONDUCT.md` and the project development and security rules.
