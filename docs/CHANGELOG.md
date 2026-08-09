# Changelog

## Revised Phase 2F and deployment handoff - 2026-08-09

- Added production public supporting pages, honest performance and pricing states, searchable Help Centre content, and responsible-play and legal drafts.
- Added the validated Contact server action, server-only Supabase client, reviewed `contact_submissions` migration, database contract, and RLS tests.
- Added the deployment runbook, release checklist, proprietary license notice, Vercel framework configuration, and current environment contract.
- Kept the Contact release gate explicit because the production migration and database-level pgTAP verification remain pending.

## Public visual system refinement - 2026-08-09

- Replaced the earlier ink, chalk, and vermilion public direction with the documented navy, pink, mint, lavender, cloud, slate, and white system.
- Added reduced-motion-safe section reveals through a focused IntersectionObserver client boundary.
- Added an infinite engineering-foundation rail using only technologies verified in the repository; it makes no customer or partner claim.
- Added three responsive, captioned conceptual football assets for evidence review, the six-stage workflow, and permanent result records.
- Made the mobile hamburger visible on solid action pink and the focus-managed navigation sheet fully opaque deep navy.
- Updated the public design preview, design-system sources, architecture notes, decision record, and historical walkthrough context without changing public URLs, APIs, authentication, or backend logic.

## Phase 2E — Complete public homepage

- Added the editorial hero, product preview, coverage, workflow, Target Odds, Daily Edge, AI Analyst, loss-first settlement, planned compatibility, analytics, trust, responsible play, plans, FAQ, final CTA, typed demo data, tests and documentation.

## Phase 2D — Public website architecture

### Added

- Public route group, typed registry, responsive header, accessible mobile Sheet and public footer.
- Token-driven marketing primitives, minimal homepage, factual placeholders, safe auth reservations, legal-review states, metadata and public loading/error/not-found states.
- Public architecture, inventory, content policy, tests and permanent walkthrough.

### Changed

- Moved authenticated Responsible Play to `/settings/responsible-play` to prevent a public URL collision.

## Phase 2C — Application shell and responsive navigation

- Added the future-authenticated `(app)` route group and fourteen feature-free placeholder routes.
- Added a typed route registry, breadcrumbs, expanded/collapsed sidebar, responsive header, five-item mobile bottom navigation, and full Sheet drawer.
- Added skip-link and landmark support, loading/error states, responsive safe-area offsets, shell tests, route inventory, and application-shell documentation.

## Phase 2B — Shared UI primitives and component library

- Expanded action components and compositional form controls.
- Added accessible feedback, layout, overlay, navigation, table, data-list, and analytical primitives.
- Kept status, confidence, risk, probability, and data quality distinct.
- Added Radix-backed keyboard/focus behavior and centralized `cn()` class merging.
- Expanded `/design-system` with fictional interactive examples and accessibility notes.
- Added behavior/accessibility tests, component API inventory, library governance, and the Phase 2B walkthrough.

## Phase 2A — Visual identity and design language

- Established PlayToday’s premium dark-first sports-intelligence identity with full future light-theme mappings.
- Added centralized semantic color, sports-status, typography, spacing, layout, radius, border, elevation, chart, and motion tokens in `@playtoday/ui`.
- Added minimum accessible Button, Input, Card, StatusChip, DataValue, SectionHeading, Skeleton, EmptyState, and ErrorState primitives with tests.
- Added the static internal `/design-system` preview with clearly labeled demonstration data and no dashboard/product behavior.
- Added design language, governance, design decisions, accessibility requirements, and the Phase 2A walkthrough.

## Step 1E — GitHub and CI foundation

- Added GitHub Actions repository guard, web quality/test/build jobs, a three-service Python quality matrix, safe caching/concurrency, and one stable final CI result.
- Added the cross-platform `pnpm ci:check` command and targeted repository policy guard.
- Added controlled weekly Dependabot checks for pnpm, GitHub Actions, and Python development tools without auto-merge.
- Added the pull-request template, bug/feature/data issue forms, private security guidance, security policy, contribution guide, and code of conduct.
- Added ownership guidance and branch-protection recommendations without inventing GitHub identities or changing remote settings.
- Added permanent GitHub/CI documentation and the Step 1E walkthrough; no deployment, secret, remote, or product feature was introduced.

This project follows a Keep a Changelog-style structure. Dates use ISO 8601.

## [Unreleased]

### Added

- Step 1A documentation foundation.
- Product brief and detailed product requirements.
- Initial system architecture, service boundaries, and data-flow diagrams.
- Controlled delivery roadmap and mandatory development rules.
- Canonical domain glossary.
- Security, compliance, data, AI, and bookmaker-integration policies.
- Initial architecture decision records.
- pnpm workspace and Turborepo monorepo foundation.
- Minimal Next.js App Router web application with accessible foundation states and `/api/health`.
- Eight private `@playtoday/*` TypeScript workspace package placeholders.
- Dependency-free Python placeholders for prediction, licensed-data ingestion, and deterministic settlement services.
- Repository editor, ignore, formatting, TypeScript, Node.js, and environment-example configuration.
- Shared TypeScript and ESLint presets published through `@playtoday/config`.
- Repository-wide Prettier, Ruff, pytest, Vitest, React Testing Library, and V8 coverage foundations.
- Legitimate health-handler, accessible foundation-page, shared-export, and Python service-identity tests.
- CI-ready non-destructive `format:check`, `test:coverage`, and `quality` commands plus consistent editor recommendations.
- Typed Zod environment schemas with separated server-only and client-safe access.
- Safe four-key `.env.example` contract and deterministic environment validation scripts.
- Environment schema, error-redaction, template, Git-ignore, and Client Component boundary tests.
- Environment and secret-handling policy with credential incident response.
- Permanent Step 1D environment and secrets walkthrough.

### Changed

- Promoted **PlayToday** to the official product name and standardized the repository as `playtoday` and package scope as `@playtoday/*`.
- Retired the former temporary working name and removed it from active project files.
- Replaced placeholder zero-test scripts with real tests only in workspaces that contain test suites.
- Centralized strict compiler and lint rules while keeping Next.js, React, and Node-library concerns scoped.
- Extended the root quality gate with environment-template and deterministic test-contract validation.

### Implementation status

- Step 1A documentation foundation completed.
- Step 1B monorepo foundation completed after install, format, lint, typecheck, zero-test, build, workspace-discovery, Python-placeholder, development-server, home-page, and health-endpoint verification.
- Step 1B passed a retroactive structural, naming, command, live-page, and health-endpoint audit before Step 1C changes.
- Step 1C code-quality and testing foundation completed after install, format, lint, typecheck, unit-test, coverage, Python-quality, production-build, comprehensive-quality, and live endpoint verification.
- Step 1D environment validation and secrets management completed after template, deterministic-runtime, negative-runtime, formatting, linting, type, unit-test, coverage, build, Python, Git-ignore, naming, secret-pattern, live-page, safe-health, and comprehensive-quality verification.
- The web application and all packages remain foundation-only.
- No Supabase, external provider, bookmaker, payment, or deployment integration configured.
