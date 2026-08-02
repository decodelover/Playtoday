# Development Rules

These rules apply to every human contributor, coding agent, review agent, and automation acting on this repository.

## Mandatory workflow

1. Work on exactly one named [roadmap](ROADMAP.md) step at a time.
2. Read the roadmap step and all linked product, architecture, security, data, bookmaker, and decision documentation before changing code.
3. Confirm the step’s dependencies are complete. Never implement a later phase early because it appears convenient.
4. State the intended scope before editing and preserve unrelated user changes.
5. Implement only the smallest coherent change that satisfies the current step.
6. Verify against the step’s acceptance and completion criteria.
7. Run applicable formatting, linting, type checking, unit, integration, and end-to-end tests before declaring completion.
8. Report every changed file, verification result, unresolved risk, assumption, and deferred item.
9. Stop when the current roadmap step is complete. Do not proceed automatically.

## Architecture and decisions

- Do not silently change architecture, service boundaries, core dependencies, data ownership, security controls, or product scope.
- Record significant decisions in [DECISIONS.md](DECISIONS.md) or a linked ADR before implementation.
- Prefer modules and shared packages inside the monorepo. A new deployable service requires an independently scalable or isolated workload, a clear owner, defined contracts, operational readiness, and an ADR.
- Do not introduce Prisma or GraphQL unless a later accepted ADR changes the initial decision.
- Keep branding replaceable; do not embed “PlayToday” into durable business types, database semantics, or external contracts without need. Repository and package identifiers use `playtoday` and `@playtoday/*`.

## Data and database

- Create reviewed, forward-only migrations for every database schema, policy, function, trigger, and seed-data change.
- Enable and test Row Level Security on every table exposed through Supabase APIs. Never bypass RLS to make a feature work.
- Keep the service-role key and all provider secrets out of frontend bundles, logs, fixtures, and source control.
- Preserve immutable publication and audit facts. Corrections append context; they do not erase original records.
- Make ingestion, settlement, webhook, notification, and scheduled jobs idempotent.
- Use licensed or explicitly approved data. Record provider, source event identifier, observed time, and freshness.

## Product integrity

- Never fabricate integrations, provider access, fixtures, odds, scores, injuries, lineups, probabilities, results, or booking codes.
- Do not scrape bookmaker websites without written approval and a completed legal, security, and technical review.
- Do not claim official SportyBet, Bet9ja, or MSport booking-code support without an approved integration.
- Label internal references, bookmaker-ready outputs, and official booking codes distinctly.
- Never describe a prediction or ticket as guaranteed, “sure,” fixed, or risk-free.
- Do not hide losing published tickets, failed legs, pass days, or correction history.
- Do not implement stakes, wallets, bet placement, loss chasing, martingale, or bookmaker credential storage.

## Security and operations

- Authorize administration with server-controlled roles, never editable user metadata.
- Apply input validation, output encoding, authentication checks, authorization checks, rate limiting, and sensitive-operation logging at trust boundaries.
- Verify payment webhooks cryptographically and process them idempotently.
- Require two-factor authentication for administrators before production administration is enabled.
- Avoid logging secrets, credentials, full payment payloads, or unnecessary personal data.
- Include rollback or recovery planning for material releases and migrations.

## Completion report template

Every implementation step must report:

- roadmap step completed;
- files created, changed, and removed;
- migrations or external configuration changed;
- commands and tests run, with results;
- acceptance criteria met;
- security, privacy, compliance, data-quality, and operational risks;
- assumptions and unresolved decisions; and
- features intentionally not implemented.
