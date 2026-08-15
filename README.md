# PlayToday

The public website uses a matchday-editorial design system and contains no fictional sports records. See `docs/PUBLIC_DESIGN_SYSTEM.md`, `docs/PUBLIC_CONTENT_AND_DATA.md`, and `docs/PUBLIC_WEBSITE_ARCHITECTURE.md`.

**Football analysis that shows its work.**

PlayToday is a planned premium sports-intelligence and target-odds decision-support SaaS. It is not a bookmaker, does not accept or hold stakes, does not place bets, and never describes predictions as guaranteed or “sure.”

## Current roadmap position

**Phase 4C: operational with real pre-match football odds and canonical markets.**

The repository contains the public and authenticated product foundation, canonical
football fixtures, real API-Football pre-match odds, current and historical odds
storage, protected ingestion schedules, and authenticated Daily Odds and Markets
views. Prediction models, AI recommendations, settlement, bookmaker codes, payments,
and Phase 4D remain unavailable.

See the controlled [roadmap](docs/ROADMAP.md) and [development rules](docs/DEVELOPMENT_RULES.md) before making changes. Authentication, live sports data, predictions, settlement, billing, and support integrations remain unavailable.

## Technology foundation

- pnpm workspaces and Turborepo
- Next.js App Router, React, TypeScript, Tailwind CSS, ESLint, Prettier, and Vitest
- Shared private packages under `@playtoday/*`
- Python 3.12+ service placeholders checked by Ruff and pytest

Supabase authentication, account settings, canonical football data, and licensed
provider odds are configured. Prediction models, AI Analyst tools, deterministic
settlement, payments, notifications, and direct bookmaker integrations remain
unavailable.

## Repository structure

```text
playtoday/
├── apps/
│   └── web/                       # Public Next.js site and application shell
├── packages/
│   ├── ai-tools/                  # Future trusted AI tool contracts
│   ├── bookmaker-adapters/        # Future bookmaker adapter contracts
│   ├── config/                    # Shared TypeScript and ESLint configuration
│   ├── database-types/            # Migration-aligned database contract
│   ├── notifications/             # Future notification abstractions
│   ├── sports-domain/             # Future universal sports types
│   ├── ui/                        # Future shared UI primitives
│   └── validation/                # Future validation schemas
├── services/
│   ├── ingestion-worker/          # Licensed-data ingestion placeholder
│   ├── prediction-api/            # Statistical prediction placeholder
│   └── settlement-worker/         # Deterministic settlement placeholder
├── supabase/                      # Local config, reviewed migrations, and DB tests
├── tests/                         # Future cross-workspace tests
└── docs/                          # Product and engineering source of truth
```

## Prerequisites

- Node.js 22.16.0 or a compatible version satisfying `package.json`
- pnpm 10.28.2 or a compatible version satisfying `package.json`
- Python 3.12+ for inspecting the service placeholders

Use pnpm only. npm, Yarn, and Bun lockfiles must not be added.

## Install and develop

```sh
pnpm install
Copy-Item .env.example .env.local
pnpm env:check
pnpm dev
```

On POSIX shells, use `cp .env.example .env.local`. Never commit `.env.local`.
Every `NEXT_PUBLIC_` value is embedded in browser-visible configuration and must never
contain a secret. The template contains non-secret examples for every required value.
Replace local examples in ignored `.env.local`; never put a real service-role key in
the template.

The web foundation is served by `@playtoday/web`. Its health endpoint is `/api/health` and returns only the service identifier and status.

## Repository commands

```sh
pnpm build           # Build all buildable workspaces
pnpm sports:sync     # Run the bounded canonical fixture ingestion job
pnpm odds:sync       # Run the bounded pre-match odds ingestion job
pnpm env:check       # Validate explicit process values or an existing .env.local
pnpm env:check:test  # Validate deterministic non-secret test values
pnpm env:example:check # Validate the committed template and ignore policy
pnpm lint            # Run ESLint and Ruff checks
pnpm lint:fix        # Deliberately apply supported lint fixes
pnpm typecheck       # Run independent workspace TypeScript checks
pnpm test            # Run legitimate Vitest and pytest suites
pnpm test:watch      # Run TypeScript tests in watch mode
pnpm test:coverage   # Run Vitest coverage and Python tests
pnpm format          # Deliberately apply Prettier and Ruff formatting
pnpm format:check    # Verify formatting without changing files
pnpm ci:check        # Run the cross-platform local CI-equivalent gate
pnpm clean           # Remove generated build and cache artefacts
```

## GitHub and pull requests

GitHub Actions now checks repository invariants, environment safety, formatting, linting, TypeScript, tests, coverage, the production build, and all three Python service placeholders. Use the [contribution guide](CONTRIBUTING.md) and pull-request template, keep work to one authorized roadmap step, and run `pnpm ci:check` before review.

Read the [security policy](SECURITY.md), [CI guide](docs/GITHUB_AND_CI.md), [branch-protection recommendations](docs/GITHUB_BRANCH_PROTECTION.md), and [Step 1E walkthrough](docs/walkthroughs/STEP_1E_GITHUB_AND_CI.md).

Deployment guidance is defined in [Deployment](docs/DEPLOYMENT.md) and the [Release checklist](docs/RELEASE_CHECKLIST.md). Production credentials belong in Vercel environment settings, never Git.

## Visual design foundation

The public design language uses deep navy, white and lavender surfaces, pink action, mint orientation, Geist typography, responsive football imagery, rounded architectural panels, reduced-motion-safe section reveals, and an honest engineering-foundation carousel. The `/design-system` route documents the current system without fictional product data and is excluded from indexing.

Read the [Public Design System](docs/PUBLIC_DESIGN_SYSTEM.md), [Public Content and Data Rules](docs/PUBLIC_CONTENT_AND_DATA.md), [Public Website Architecture](docs/PUBLIC_WEBSITE_ARCHITECTURE.md), and [Public Route Inventory](docs/PUBLIC_ROUTE_INVENTORY.md) before future public interface work.

The authenticated application shell and shared `@playtoday/ui` library remain separate from the public visual system. Read [Application Shell](docs/APPLICATION_SHELL.md) for that boundary and [Phase 4C Odds and Markets](docs/PHASE_4C_ODDS_AND_MARKETS.md) for the operational odds workflow.

## Product restrictions

PlayToday must not:

- accept stakes, hold betting balances, process betting deposits or withdrawals, or place bets;
- store bookmaker credentials;
- invent fixtures, odds, probabilities, results, or booking codes;
- scrape bookmakers without written authorization;
- claim official booking-code support without an approved integration; or
- use guaranteed-win language, encourage chasing losses, or implement martingale strategies.

## Documentation

The [docs directory](docs/) is the permanent source of truth. Start with the [product brief](docs/PRODUCT_BRIEF.md), [requirements](docs/PRODUCT_REQUIREMENTS.md), [architecture](docs/ARCHITECTURE.md), [roadmap](docs/ROADMAP.md), and [decision records](docs/DECISIONS.md). Environment handling is defined in [Environment and Secrets](docs/ENVIRONMENT_AND_SECRETS.md). Publication and operations are defined in the [CI guide](docs/GITHUB_AND_CI.md), [deployment runbook](docs/DEPLOYMENT.md), and [release checklist](docs/RELEASE_CHECKLIST.md).
