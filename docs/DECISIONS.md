# Architecture Decision Records

## Index

| ID      | Decision                                                  | Date       | Status   |
| ------- | --------------------------------------------------------- | ---------- | -------- |
| ADR-001 | Football-first MVP                                        | 2026-08-02 | Accepted |
| ADR-002 | Web and PWA before native mobile                          | 2026-08-02 | Accepted |
| ADR-003 | Supabase as the operational platform                      | 2026-08-02 | Accepted |
| ADR-004 | Python for prediction and settlement services             | 2026-08-02 | Accepted |
| ADR-005 | Next.js for the product interface                         | 2026-08-02 | Accepted |
| ADR-006 | No Prisma initially                                       | 2026-08-02 | Accepted |
| ADR-007 | No GraphQL initially                                      | 2026-08-02 | Accepted |
| ADR-008 | No automatic bet placement                                | 2026-08-02 | Accepted |
| ADR-009 | No bookmaker credential storage                           | 2026-08-02 | Accepted |
| ADR-010 | No guaranteed prediction claims                           | 2026-08-02 | Accepted |
| ADR-011 | Official booking-code generation requires approved access | 2026-08-02 | Accepted |
| ADR-012 | Modular monorepo instead of excessive microservices       | 2026-08-02 | Accepted |
| ADR-013 | Official PlayToday name and namespace                     | 2026-08-02 | Accepted |

Statuses are **Proposed**, **Accepted**, **Superseded**, or **Rejected**. A material change requires a new ADR that links to and supersedes the earlier record; do not rewrite accepted history silently.

## ADR-001 — Football-first MVP

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Multi-sport data models, features, calibration, market semantics, and settlement rules multiply validation and operational risk.
- **Decision:** Limit the production MVP to pre-match football in major, statistically reliable approved competitions and the markets named in the requirements.
- **Consequences:** Football can receive deeper quality and settlement testing. Basketball and tennis require later explicit roadmap phases and cannot be slipped into the MVP.

## ADR-002 — Web and PWA before native mobile applications

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** The product needs responsive daily use and notifications, but separate native clients would increase release, design, and security scope before product validation.
- **Decision:** Deliver a responsive web application and installable PWA first.
- **Consequences:** One interface supports desktop and mobile browsers. Native-only capabilities and app-store distribution are deferred; PWA caching must never disguise stale sports state.

## ADR-003 — Supabase as the operational platform

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** The MVP needs PostgreSQL, authentication, user isolation, realtime updates, storage, and scheduled/queued work with a small operational footprint.
- **Decision:** Use Supabase PostgreSQL, Auth, RLS, Realtime, Storage, Cron, and Queues as the planned operational platform.
- **Consequences:** Database design and RLS policy quality become central. Service-role access stays server-side. Vendor limits, regions, backups, recovery, cost, and queue semantics require validation before production.

## ADR-004 — Python for prediction and settlement services

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Statistical/ML work benefits from the Python data ecosystem, while deterministic settlement also benefits from explicit, heavily tested domain rules close to normalized sports data processing.
- **Decision:** Use Python 3.12+ and FastAPI for the prediction API, and Python workers for ingestion and settlement, using Pydantic contracts and suitable numerical/ML libraries.
- **Consequences:** The team maintains TypeScript–Python contracts and two toolchains. Settlement must remain isolated from generative AI despite sharing the language/runtime with prediction work.

## ADR-005 — Next.js for the product interface

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** The product requires public content, authenticated dashboards, responsive interaction, server capabilities, and a PWA path.
- **Decision:** Use Next.js 16, React 19, and TypeScript for the web product.
- **Consequences:** Server/client boundaries, cache freshness, and secret isolation need explicit review. Framework version compatibility must be checked during initialization rather than assumed from this ADR.

## ADR-006 — No Prisma initially

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Supabase migrations, PostgreSQL features, generated database types, and RLS policies are authoritative; another schema abstraction could duplicate ownership and obscure security behavior.
- **Decision:** Do not introduce Prisma initially. Use reviewed SQL migrations, Supabase tooling, generated database types, and narrow data-access modules.
- **Consequences:** Contributors need PostgreSQL and RLS competence. A future ORM/query builder requires measured need and a superseding ADR; it cannot replace migrations or RLS.

## ADR-007 — No GraphQL initially

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** MVP clients and service boundaries do not yet justify a separate graph schema, resolver authorization layer, and operational surface.
- **Decision:** Use typed server endpoints, database queries governed by RLS, and explicit service contracts; do not add GraphQL initially.
- **Consequences:** Interfaces remain simpler and purpose-specific. Reconsider only when demonstrated multi-client query needs outweigh complexity, with authorization and observability addressed in a new ADR.

## ADR-008 — No automatic bet placement

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Bet placement would materially change product classification, financial risk, security, integrations, and user harm exposure.
- **Decision:** The platform will not place, submit, or confirm bets or accept instructions to do so.
- **Consequences:** Outputs stop at analysis and clearly labeled bookmaker-ready information. No background automation, browser control, or partner interface may circumvent this boundary.

## ADR-009 — No bookmaker credential storage

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Holding bookmaker authentication data creates account-takeover risk and facilitates prohibited account access and bet placement.
- **Decision:** Never request, store, proxy, or retain user bookmaker passwords, sessions, tokens, PINs, or recovery factors.
- **Consequences:** Users independently access bookmakers. Integrations, if approved, use platform-owned scoped credentials and may not impersonate user sessions.

## ADR-010 — No guaranteed prediction claims

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Sports outcomes are uncertain; confidence and DQS metrics can be confused with outcome probability, creating consumer harm and misleading marketing.
- **Decision:** Never describe predictions as guaranteed, “sure,” risk-free, or 95–100% accurate. Name estimated probability, model confidence, and DQS separately.
- **Consequences:** Product copy, AI prompts, notifications, analytics, and marketing require claim controls. Historical results include losses and uncertainty and cannot be used as a guarantee.

## ADR-011 — Official booking-code generation requires approved access

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** SportyBet, Bet9ja, and MSport code generation depends on bookmaker-specific authorization, contracts, interfaces, and expiry rules that are not currently established.
- **Decision:** Keep official booking-code generation unavailable until official API access, approved partnership/affiliate integration, or written technical permission is documented and reviewed.
- **Consequences:** The MVP may emit internal references and bookmaker-ready lists with explicit labels. Unauthorized scraping or reverse engineering is not an alternative.

## ADR-012 — Modular monorepo instead of excessive microservices

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Independent services add network, consistency, release, observability, and staffing costs. The product still needs clear runtime boundaries for the web tier, Python inference, and background processing.
- **Decision:** Use a Turborepo/pnpm modular monorepo with shared domain packages and only the planned deployable boundaries. Require an ADR and operational justification for new services.
- **Consequences:** Modules share repository workflows and contracts while web, prediction, ingestion, and settlement responsibilities remain explicit. Do not create services per sport, market, bookmaker, or page.

## ADR-013 — Official PlayToday name and namespace

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** The former temporary working name “EdgePilot AI” was retired before monorepo initialization. A single official product identity and predictable technical namespace are required.
- **Decision:** Use **PlayToday** for product-facing text, `playtoday` for the repository/root package and filesystem identifiers, and `@playtoday/*` for JavaScript workspace packages.
- **Consequences:** Active documentation and interfaces use PlayToday. The retired name is preserved only in this decision and the changelog as explicit historical context. Branding remains outside durable sports-domain semantics where practical.
