# PlayToday

**AI-powered sports intelligence for today’s games.**

PlayToday is a planned premium sports-intelligence and target-odds decision-support SaaS. It is not a bookmaker, does not accept or hold stakes, does not place bets, and never describes predictions as guaranteed or “sure.”

## Current roadmap position

**Step 1B — Monorepo initialization: complete.**

The repository now contains the development foundation only. The web application displays a development placeholder; shared packages and Python services expose non-operational identity placeholders. No product functionality has been implemented.

See the controlled [roadmap](docs/ROADMAP.md) and [development rules](docs/DEVELOPMENT_RULES.md) before making changes. Step 1C remains not started and is not authorized by completion of this step.

## Technology foundation

- pnpm workspaces and Turborepo
- Next.js App Router, React, TypeScript, Tailwind CSS, and ESLint
- Shared private packages under `@playtoday/*`
- Dependency-free Python 3.12+ service placeholders

Supabase, authentication, sports data, prediction models, AI Analyst tools, deterministic settlement, payments, notifications, and bookmaker integrations are **not configured**.

## Repository structure

```text
playtoday/
├── apps/
│   └── web/                       # Minimal Next.js foundation
├── packages/
│   ├── ai-tools/                  # Future trusted AI tool contracts
│   ├── bookmaker-adapters/        # Future bookmaker adapter contracts
│   ├── config/                    # Future shared configuration
│   ├── database-types/            # Future generated database types
│   ├── notifications/             # Future notification abstractions
│   ├── sports-domain/             # Future universal sports types
│   ├── ui/                        # Future shared UI primitives
│   └── validation/                # Future validation schemas
├── services/
│   ├── ingestion-worker/          # Licensed-data ingestion placeholder
│   ├── prediction-api/            # Statistical prediction placeholder
│   └── settlement-worker/         # Deterministic settlement placeholder
├── supabase/                      # Unconfigured future placeholder
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
pnpm dev
```

The web foundation is served by `@playtoday/web`. Its health endpoint is `/api/health` and returns only the service identifier and status.

## Repository commands

```sh
pnpm build       # Build all buildable workspaces
pnpm lint        # Run workspace lint checks
pnpm typecheck   # Run workspace TypeScript checks
pnpm test        # Run available tests; currently reports zero tests honestly
pnpm format      # Check formatting for supported files
pnpm clean       # Remove generated build and cache artefacts
```

## Product restrictions

PlayToday must not:

- accept stakes, hold betting balances, process betting deposits or withdrawals, or place bets;
- store bookmaker credentials;
- invent fixtures, odds, probabilities, results, or booking codes;
- scrape bookmakers without written authorization;
- claim official booking-code support without an approved integration; or
- use guaranteed-win language, encourage chasing losses, or implement martingale strategies.

## Documentation

The [docs directory](docs/) is the permanent source of truth. Start with the [product brief](docs/PRODUCT_BRIEF.md), [requirements](docs/PRODUCT_REQUIREMENTS.md), [architecture](docs/ARCHITECTURE.md), [roadmap](docs/ROADMAP.md), and [decision records](docs/DECISIONS.md).
