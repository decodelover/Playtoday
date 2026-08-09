# Architecture Decision Records

## ADR-036 - Server-only contact persistence with fail-closed public access

- **Date:** 2026-08-09
- **Status:** Accepted
- **Context:** Revised Phase 2F requires a functional public contact path without exposing a database write policy or reporting success before persistence.
- **Decision:** Validate and normalize submissions in a Next.js server action, use a server-only Supabase secret key for the insert, force RLS on `contact_submissions`, grant no `anon` or `authenticated` access, and return an honest error when configuration or persistence fails.
- **Consequences:** The browser cannot insert or read contact records directly. A deployed environment must apply the migration and supply the two server-only variables. Database-level pgTAP verification remains a release gate when no local Docker or linked project is available.

## ADR-035 - Sport-platform public system with progressive motion

- **Date:** 2026-08-09
- **Status:** Accepted
- **Supersedes:** ADR-034 visual presentation details only; ADR-034 factual-data and backend-boundary requirements remain in force.
- **Decision:** Use deep navy `#01002C`, soft navy `#04193B`, ground blue `#082D4B`, action pink `#FF0F50`, pink hover `#DB003B`, mint `#4ED8A0`, lavender `#E3E2FF`, cloud `#F0F0F5`, slate `#4D4C68`, and white for the public system. Public heroes and selected sections use responsive football imagery with legibility overlays. Sections progressively reveal through a narrow IntersectionObserver client boundary, and the homepage may run an engineering-foundation carousel that names only verified repository technologies.
- **Consequences:** Reduced-motion mode reveals all content and stops continuous movement. The mobile navigation trigger and sheet use opaque brand surfaces. Generated assets contain no readable sports records, and the carousel cannot be labelled as customers, trusted organizations, or data partners without an approved source.

## ADR-034 — Public editorial rebuild without fictional data

- **Date:** 2026-08-09
- **Status:** Accepted
- **Decision (historical visual details superseded by ADR-035):** Keep every public path and backend boundary intact while replacing the public presentation with a matchday-editorial system. Public pages used ink, chalk paper, one vermilion signal, asymmetric layouts, and direct sourced copy at that stage. The fictional homepage data source and public design-preview samples were removed. When no production source exists, the interface states that no record is published.
- **Consequences:** Public fixtures, odds, prices, plans, performance figures, testimonials, and legal claims require an approved source. Current guidance lives in `PUBLIC_DESIGN_SYSTEM.md`, `PUBLIC_CONTENT_AND_DATA.md`, and `PUBLIC_WEBSITE_ARCHITECTURE.md`.

## ADR-033 — Truthful anti-template homepage

- **Date:** 2026-08-04
- **Status:** Superseded by ADR-034
- **Decision:** Design phases use Taste Skill and UI/UX Pro Max with PlayToday tokens. The server-first homepage uses labelled deterministic demo data, shows football-first availability, pass days and losses, and rejects fake proof, performance and partnership claims. Copy is governed by `HOMEPAGE_CONTENT.md`; motion is restrained.

## ADR-032 — Separate public website foundation

- **Date:** 2026-08-04
- **Status:** Accepted
- **Decision:** Keep public and authenticated layouts and route registries separate. The public site uses a header, footer and mobile Sheet—not authenticated navigation. Claims remain factual; fake testimonials/performance and final content are deferred. Metadata uses the configured application URL. The provisional text wordmark remains. Sign-in/sign-up are form-free placeholders until Phase 3.
- **Consequences:** Public routes require inventory, metadata and tests and cannot imply operational authentication, billing or performance.

## Phase 2B shared-component decisions

- `@playtoday/ui` remains feature-independent and never calls external services.
- Proven accessible primitives may support complex behavior; client boundaries remain minimal.
- `/design-system` remains the foundation showcase and Storybook is deferred.
- Component variants use semantic names and tokens.
- Status, confidence, probability, risk, and data quality remain distinct concepts.
- Feature components compose shared primitives instead of duplicating them.
- Applications import from public UI entry points and never deep-import internals.

## Phase 2A visual-system architecture

- `@playtoday/ui` is the shared visual source of truth.
- CSS custom properties own theme values; typed exports reference semantic variables.
- Launch is dark-first with independently defined future light-theme mappings.
- Semantic tokens separate action, live, provisional, settled, warning, danger, and chart meaning.
- Geist/Geist Mono provide interface and tabular numeric typography.
- Lucide is the approved future outline icon system; no additional icon library is added for the icon-free foundation preview.
- Motion is restrained, tokenized, and disabled to 1ms under reduced-motion preference.
- Status never relies on color alone.
- Casino aesthetics and guaranteed-outcome copy are prohibited.
- `/design-system` remains development-purpose, static, and non-operational.

## Step 1E GitHub and CI decisions

- **CI provider:** GitHub Actions is the repository CI provider; remote execution begins only after an authorized GitHub remote exists.
- **Permissions:** foundation CI is read-only (`contents: read`), persists no checkout credential, uses no OIDC, and grants no write scope.
- **Integrity:** every CI install uses the frozen pnpm lockfile and declared Node/pnpm versions.
- **Parity:** repository scripts are the source of truth; `pnpm ci:check` provides cross-platform local reproduction.
- **Boundary:** CI performs no deployment, release, publishing, external product-service call, or secret consumption in this phase.
- **Fork safety:** `pull_request_target` is prohibited; untrusted pull-request code receives no repository secret or elevated token.
- **Required result:** one `PlayToday CI` job evaluates all mandatory dependencies for future branch protection.
- **Dependencies:** Dependabot runs weekly, groups compatible updates, never auto-merges, and every update requires ordinary CI and human review; major versions require explicit review.
- **Actions:** supported stable action majors are used and future workflow changes must re-check official versions.
- **Failure policy:** mandatory jobs never use `continue-on-error` or failure-swallowing commands.

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
| ADR-014 | Shared configuration through `@playtoday/config`          | 2026-08-02 | Accepted |
| ADR-015 | pnpm is the only JavaScript package manager               | 2026-08-02 | Accepted |
| ADR-016 | Vitest for TypeScript unit tests                          | 2026-08-02 | Accepted |
| ADR-017 | React Testing Library for component behavior              | 2026-08-02 | Accepted |
| ADR-018 | Ruff and pytest for Python service quality                | 2026-08-02 | Accepted |
| ADR-019 | No initial Git-hook framework                             | 2026-08-02 | Accepted |
| ADR-020 | Quality commands must expose failures                     | 2026-08-02 | Accepted |
| ADR-021 | Typed environment access                                  | 2026-08-02 | Accepted |
| ADR-022 | Separate server and client environment modules            | 2026-08-02 | Accepted |
| ADR-023 | No scattered direct environment access                    | 2026-08-02 | Accepted |
| ADR-024 | No real credentials in templates                          | 2026-08-02 | Accepted |
| ADR-025 | `NEXT_PUBLIC_` values are always public                   | 2026-08-02 | Accepted |
| ADR-026 | Production environment validation fails clearly           | 2026-08-02 | Accepted |
| ADR-027 | External variables begin in their integration phase       | 2026-08-02 | Accepted |
| ADR-028 | No platform linking during Step 1D                        | 2026-08-02 | Accepted |
| ADR-035 | Sport-platform public system with progressive motion      | 2026-08-09 | Accepted |
| ADR-036 | Server-only contact persistence with fail-closed access   | 2026-08-09 | Accepted |

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
- **Context:** A former temporary working name was retired before monorepo initialization. A single official product identity and predictable technical namespace are required.
- **Decision:** Use **PlayToday** for product-facing text, `playtoday` for the repository/root package and filesystem identifiers, and `@playtoday/*` for JavaScript workspace packages.
- **Consequences:** Active documentation and interfaces use PlayToday, and the retired name is not retained in active files. Branding remains outside durable sports-domain semantics where practical.

## ADR-014 — Shared configuration through `@playtoday/config`

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Independently copied lint and compiler settings drift and can apply framework-specific rules to the wrong workspace.
- **Decision:** Publish supported base, React, and Next.js ESLint flat configurations and base, Node-library, React-library, and Next.js TypeScript configurations from the private `@playtoday/config` workspace.
- **Consequences:** Workspaces select a small relevant preset and declare a one-way development dependency on configuration. Configuration changes are reviewed and verified repository-wide.

## ADR-015 — pnpm is the only JavaScript package manager

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Multiple package managers create competing lockfiles and non-reproducible workspace resolution.
- **Decision:** Use the pinned pnpm package manager and committed `pnpm-lock.yaml` exclusively for JavaScript dependency and script operations.
- **Consequences:** npm, Yarn, and Bun lockfiles are not accepted. Contributors use the package-manager version declared by the root package.

## ADR-016 — Vitest for TypeScript unit tests

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** The monorepo needs fast TypeScript-native unit tests and V8 coverage without pretending unimplemented features exist.
- **Decision:** Use Vitest for legitimate TypeScript tests, with Node as the default environment and jsdom only for tests that render browser UI.
- **Consequences:** Only packages with real tests expose test scripts. Coverage thresholds begin at 80% for selected foundation modules and increase with product code.

## ADR-017 — React Testing Library for component behavior

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** UI tests should validate observable and accessible behavior rather than component internals.
- **Decision:** Use React Testing Library with jest-dom matchers for rendered component behavior.
- **Consequences:** Queries prefer roles, names, and visible text. Snapshot-only or implementation-detail tests do not satisfy behavior coverage.

## ADR-018 — Ruff and pytest for Python service quality

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** The three Python placeholders need one consistent, modern quality workflow without runtime or machine-learning dependencies.
- **Decision:** Configure Ruff formatting/linting and pytest centrally in the root `pyproject.toml`, targeting Python 3.12+.
- **Consequences:** Each placeholder has a legitimate identity test. Service runtime dependencies remain empty until their authorized roadmap steps.

## ADR-019 — No initial Git-hook framework

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Hook frameworks add installation and contributor-state complexity before repository workflows or CI require them.
- **Decision:** Use documented, CI-ready repository scripts and add no Husky, lint-staged, or commit-message hook tooling in the initial foundation.
- **Consequences:** Contributors run `pnpm quality` deliberately. A later hook proposal must identify a measured need and preserve an accessible manual command.

## ADR-020 — Quality commands must expose failures

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** A green command is useful only when every required underlying check ran and its failure propagated.
- **Decision:** Quality scripts must not use success-forcing fallbacks, fake tests, unconditional successful exits, or error suppression. `pnpm quality` is non-destructive and composes formatting verification, linting, type checking, coverage tests, Python tests, and builds.
- **Consequences:** Failures stop the command and remain visible. Mutating fixes use separate explicit `format` and `lint:fix` commands.

## ADR-021 — Typed environment access

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Untyped strings allow missing, malformed, and unsupported configuration to reach runtime behavior.
- **Decision:** Validate PlayToday environment inputs with Zod and export inferred types from controlled modules.
- **Consequences:** New variables require schema, template, documentation, and test updates. Errors identify variable names without including values.

## ADR-022 — Separate server and client environment modules

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Next.js browser bundles expose public variables, while server configuration may later contain credentials.
- **Decision:** Maintain a `server-only` module for private/runtime access and a separate client module containing explicit `NEXT_PUBLIC_` references only.
- **Consequences:** Client Components cannot import the server module. Shared schemas may run in either environment but contain no values.

## ADR-023 — No scattered direct environment access

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Distributed `process.env` reads bypass validation and make exposure review incomplete.
- **Decision:** Limit direct environment reads to controlled environment modules, unavoidable build tooling, and tests specifically exercising environment behavior.
- **Consequences:** Application features consume typed exports. Every remaining direct read must be reviewable and justified.

## ADR-024 — No real credentials in templates

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Templates are tracked and copied widely; realistic examples can be mistaken for live credentials or trigger unsafe reuse.
- **Decision:** Environment templates contain only empty or unmistakably non-secret examples. Live credentials belong in approved secret storage or ignored local files.
- **Consequences:** Targeted template checks reject unknown foundation keys and obvious credential shapes but are not represented as a complete secret scanner.

## ADR-025 — `NEXT_PUBLIC_` values are always public

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Next.js substitutes `NEXT_PUBLIC_` values into browser-visible bundles.
- **Decision:** Classify every `NEXT_PUBLIC_` value as public regardless of where it was originally supplied.
- **Consequences:** Secrets, private service addresses, tokens, and personal data can never use this prefix. Public additions require browser-bundle review.

## ADR-026 — Production environment validation fails clearly

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Silent production defaults mask deployment mistakes, while value-bearing errors can leak secrets.
- **Decision:** Require every production contract value explicitly and fail with affected variable names only.
- **Consequences:** Invalid deployments stop early. Production defaults cannot be added merely to keep a build green.

## ADR-027 — External variables begin in their integration phase

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Premature provider key names imply unapproved integrations and create unused secret-management obligations.
- **Decision:** Introduce Supabase, sports-data, bookmaker, AI, payment, and other external variables only when their roadmap phase authorizes the integration.
- **Consequences:** Step 1D defines only four foundation variables. Each future credential requires ownership, scope, rotation, revocation, and incident controls.

## ADR-028 — No platform linking during Step 1D

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Linking Vercel or Supabase would create external state and may pull credentials before the relevant environment and integration decisions are approved.
- **Decision:** Do not run Vercel link/env commands, initialize or link Supabase, or deploy during Step 1D.
- **Consequences:** The repository remains provider-disconnected. Later authorized phases must record project ownership and secret boundaries before linking.

## ADR-029 — Central typed application routes

- **Date:** 2026-08-04
- **Status:** Accepted
- **Decision:** Sidebar, mobile navigation, drawer, breadcrumbs, and placeholders consume one typed route registry and semantic `aria-current` matching.
- **Consequences:** Route additions require inventory and tests; navigation labels are not duplicated.

## ADR-030 — Responsive shell navigation model

- **Date:** 2026-08-04
- **Status:** Accepted
- **Decision:** Use an expanded desktop sidebar, collapsed tablet/compact sidebar, five-item mobile bottom navigation, and a Sheet drawer for complete access.
- **Consequences:** Fixed offsets and safe areas are centralized; collapsed preference remains session-local until user profiles exist.

## ADR-031 — Route-aware shell stays app-local

- **Date:** 2026-08-04
- **Status:** Accepted
- **Decision:** Next.js route-aware composition remains in `apps/web`; generic primitives remain in `@playtoday/ui`.
- **Consequences:** No authentication, subscription gating, or feature permissions enter Phase 2C. Placeholder pages cannot show fake operational data.
