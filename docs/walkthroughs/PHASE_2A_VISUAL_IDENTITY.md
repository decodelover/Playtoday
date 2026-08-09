# Phase 2A Visual Identity Walkthrough

> **Current-system note, 2026-08-09:** This file preserves the historical Phase 2A authenticated-application foundation. It is not the current public-page specification. Public pages now use the navy, pink, mint, lavender, cloud, slate, and white system, responsive football imagery, and progressive scroll reveals documented in `docs/PUBLIC_DESIGN_SYSTEM.md` and `design-system/playtoday/MASTER.md`. The authenticated `@playtoday/ui` semantic token system remains separate.

## Original Plan

The visible plan preceded repository changes and defined sixteen groups: Phase 1 audit; existing visual audit; product/audience analysis; competitive research; brand positioning; color; typography; spacing/radius/border/elevation; icons/charts; motion; responsive behavior; accessibility; shared token architecture; minimum preview implementation; documentation/roadmap updates; and final verification.

For every group it named purpose, inspected and changed files, likely commands, and expected result. It proposed a premium dark-first sports-intelligence terminal, enumerated casino/crowding/contrast/status/token/scope risks, excluded all Phase 2B and product behavior, listed documents/tokens/primitives/tests/preview deliverables, and required every Phase 1, visual, accessibility, safety, and CI criterion to pass.

## Repository State Before Work

- Phase 1 Steps 1A-1E were complete and their full frozen-install/environment/format/lint/type/test/coverage/build/quality/CI suite passed.
- One pnpm/Turborepo root existed with Next.js 16, React 19, Tailwind CSS 4, `@playtoday/ui`, and `@playtoday/config`.
- The home page was a foundation-only card; `/api/health` was safe.
- `@playtoday/ui` exported only its identity constant and one test.
- Styling was provisional raw CSS with a system-font stack; no production identity, token system, dashboard, navigation, authentication, Supabase, data, prediction, settlement, or bookmaker interface existed.
- The worktree contained uncommitted Phase 1 changes, which were preserved.

## Research Findings

- The installed UI/UX database favored dense analytical hierarchy, semantic tokens, 4/8px spacing, tabular numbers, 44px targets, visible focus, and 150-300ms motion.
- Carbon, Primer, and Atlassian guidance supported ordered chart colors, 3:1 graphical contrast, 4.5:1 text contrast, direct labels/legends, separators, varied line/marker styles, and non-color meaning.
- Useful product-category patterns were calm dark surfaces, stable data alignment, progressive disclosure, compact labeled statuses, and mobile summary transformations.
- Rejected patterns were green-led actions, red/green-only charts, casino/crypto mimicry, glass/neon effects, giant KPI cards, editorial display faces, decorative animation, and copied branding.
- The 21st catalog could not be queried because the CLI was not authenticated; local context and deterministic review were used. No catalog component was copied.

## Design Decisions

- Deep navy, dark-first foundation with complete future light mappings.
- Blue action, cyan live, teal provisional positive, emerald settled success.
- Geist interface typography and Geist Mono tabular data.
- CSS custom properties as the value source; typed exports reference variables.
- Dedicated chart palette separate from status semantics.
- 120/200/320ms restrained motion with 1ms reduced-motion override.
- Lucide approved for future icons; no dependency needed for this icon-free preview.
- Status always combines label, marker/shape, border, and color.
- Provisional text wordmark only.
- Static development-purpose preview; no dashboard or product workflow.

## Work Completed

1. Added semantic dark/light themes; typography, spacing/layout, radius, border, elevation, icon-size, motion, chart, and 17-status tokens.
2. Added typed CSS-variable exports and status definitions.
3. Added Button, Input, Card, StatusChip, DataValue, SectionHeading, Skeleton, EmptyState, and ErrorState.
4. Added component/token/accessibility tests and preview safety/rendering tests.
5. Added `/design-system` with only labeled demonstration data.
6. Applied self-hosted Geist/Geist Mono through the `geist` package and migrated the home foundation CSS to shared tokens.
7. Added design language, governance, design decisions, 21st context, roadmap, changelog, README, ADR, rules, UI package, and walkthrough records.

## Files Changed

Created: `.21st/design.json`, `.21st/DESIGN.md`, `docs/DESIGN_LANGUAGE.md`, `docs/DESIGN_SYSTEM_GOVERNANCE.md`, `docs/DESIGN_DECISIONS.md`, this walkthrough, the `/design-system` route/module/test, UI token/style/primitives files, UI token/primitive/style tests, and `packages/ui/README.md`.

Modified: `README.md`, `apps/web/package.json`, app layout/global CSS, web Vitest configuration, `packages/ui/package.json`, UI TypeScript configurations/index, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/DECISIONS.md`, and `docs/DEVELOPMENT_RULES.md`.

Deleted: none.

Dependencies: added the existing workspace `@playtoday/ui` to the web application; added `geist@1.7.2` for deterministic self-hosted fonts; added React/testing peer and development declarations required for typed/tested TSX primitives. No runtime product, chart, motion, sports, or icon dependency was added.

## Commands Executed

- Phase 1 frozen install, environment checks, format, lint, typecheck, test, coverage, build, quality, and CI-equivalent command - PASS.
- Skill research commands for design-system, accessibility/motion, charts, icons, and Next.js - PASS; 21st catalog search unavailable without authentication.
- `21st init --design-context` and refresh - PASS.
- `21st review ... --strict` - informational raw-color notices confined to centralized theme/token definitions.
- `pnpm install --frozen-lockfile` - PASS.
- Targeted and full UI/web format, lint, type, test, coverage, and build commands - PASS after the corrections recorded below.
- `pnpm quality` - PASS.
- `pnpm ci:check` - PASS; repository guard and all local CI-equivalent checks passed.
- HTTP probes against the running application for `/`, `/design-system`, and `/api/health` - PASS, all returned 200 and expected safe content.
- Python Ruff format/lint and Pytest checks - PASS (12 files formatted, lint clean, 3 tests passed).

## Plan Deviations

- Reading the attached brief required one command before its embedded plan-first instruction could be discovered; no repository file was changed before the full visible plan.
- 21st catalog inspiration was unavailable without user authentication, so no login was requested and no component was installed. Local design context/review plus installed design intelligence and reputable public guidance were used.
- The generic research output's green primary, editorial display font, and decorative scroll reveal were rejected as inconsistent with product trust and status clarity.
- Lucide is documented but not installed because the static preview needs no functional icon and unnecessary dependencies are out of scope.
- The first font implementation used `next/font/google`; live HTTP verification exposed external font-fetch delay and fallback warnings. It was replaced with the self-hosted `geist` package, after which build and HTTP checks passed deterministically.
- The first final sweep found Prettier normalization, three lint-style findings, and insufficient UI primitive coverage. Syntax was corrected, coverage tests were expanded, and the complete quality/CI suite then passed.
- The installed `agent-browser` command was unavailable, and the in-app browser reported no provisioned browser after bootstrap checks. Verification therefore used production builds, HTTP probes, rendering tests, semantic queries, contrast calculations, responsive CSS inspection, focus/reduced-motion assertions, and safety scans. No interactive screenshot claim is made.
- A stale local Next.js listener and the temporary verification server were identified by exact PID and stopped after use; no listener remained on ports 3000 or 3001.

## Verification Results

- Frozen dependency install, environment validation, Prettier, Ruff formatting, ESLint, Ruff lint, TypeScript, Vitest, Pytest, coverage, Turborepo build, repository guard, `pnpm quality`, and `pnpm ci:check`: PASS.
- Tests: web 20/20, UI 14/14, Python 3/3.
- Coverage: web 100% statements/lines/functions and 85.71% branches; UI 100% statements/lines/functions and 86.2% branches.
- Production routes: `/` static, `/design-system` static, `/api/health` dynamic; build PASS.
- Runtime probes: home 200, preview 200 with notice/demonstration/status content, health 200 with safe response.
- Dark-theme contrast tests: core text/status pairs meet 4.5:1; all six chart series meet 3:1 against the application background.
- Accessibility code checks: visible labels, semantic status/alert/loading text, non-color markers, `:focus-visible`, 44px targets, responsive breakpoints, and reduced-motion override present and tested.
- Scope/safety checks: preview contains demonstration-only data; no dashboard, navigation shell, auth, Supabase, live data, predictions, settlement flow, bookmaker logo/code, or Phase 2B feature was introduced.
- Source checks: primitive/feature CSS contains no raw hex values; raw colors remain confined to centralized token/theme definitions.
- `git diff --check`: PASS. Ports 3000/3001: no remaining listeners.

## Remaining Risks

- Light-theme tokens are complete but no user-facing theme switch is authorized or tested as a product preference.
- Dedicated assistive-technology and screenshot-regression infrastructure remain future governance work.
- 21st catalog research remains unavailable until an authorized user signs in.
- Interactive browser verification was unavailable in this environment; deterministic rendered-component, HTTP, CSS, build, and accessibility checks passed.

## Final Decision

PASS WITH WARNINGS - Phase 2A is complete and Phase 2B has not started. The warnings are tooling limitations: 21st catalog search required authentication, and no interactive browser binary was provisioned. Equivalent deterministic code, test, build, accessibility, HTTP, and CI verification passed.
