# Changelog

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

### Changed

- Promoted **PlayToday** to the official product name and standardized the repository as `playtoday` and package scope as `@playtoday/*`.
- Retired the former “EdgePilot AI” working name; it remains only as historical context in this changelog and ADR-013.

### Implementation status

- Step 1A documentation foundation completed.
- Step 1B monorepo foundation completed after install, format, lint, typecheck, zero-test, build, workspace-discovery, Python-placeholder, development-server, home-page, and health-endpoint verification.
- The web application and all packages remain foundation-only.
- No Supabase, external provider, bookmaker, payment, or deployment integration configured.
