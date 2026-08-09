# Phase 2D Public Website Architecture Walkthrough

> **Current-system note, 2026-08-09:** This file records the original public-shell phase. The current shell adds a focused `ScrollReveal` client boundary, an opaque navy mobile sheet with a solid-pink native hamburger, responsive image-backed heroes, and the homepage engineering-foundation rail. Routes and backend boundaries remain unchanged. See `docs/PUBLIC_WEBSITE_ARCHITECTURE.md` and `docs/PUBLIC_DESIGN_SYSTEM.md` for the current specification.

## Original plan

The visible pre-change walkthrough covered: Phase 2C retroactive audit; root/public route audit; separate public route and navigation architecture; accessible mobile navigation; footer; marketing containers and primitives; metadata/SEO; public states and placeholders; accessibility/responsive review; tests; documentation; and final verification. It identified likely files, commands, dependencies and expected results for all sixteen steps.

## Repository state before work

Phase 1, 2A and 2B were complete. Phase 2C had an implemented typed authenticated shell but remained pending live-browser verification. The root contained one minimal foundation page; there was no public route group, public registry, header/footer, marketing system or public metadata strategy. The complete baseline command matrix passed: frozen install, environment checks, formatting, lint, typecheck, 31 web tests, 32 UI tests, coverage, build (19 routes), quality, CI-equivalent checks, Ruff and three Python tests. No authentication, Supabase, live sports data or public production site existed.

## Public route architecture

`(public)` now owns `/`, `/how-it-works`, `/performance`, `/pricing`, `/responsible-play`, `/about`, `/contact`, `/help`, `/privacy`, `/terms`, `/sign-in` and `/sign-up`. The typed `publicRoutes` registry contains label, path, header/mobile/footer visibility, title, description and foundation status. The authenticated Responsible Play placeholder moved to `/settings/responsible-play` to avoid duplicate URLs.

## Navigation and footer decisions

Desktop navigation is intentionally limited to How It Works, Performance, Pricing and Responsible Play. About and Help remain available in the complete mobile/footer information architecture. Sign In and Get Started lead to safe, form-free placeholders. A Radix Sheet supplies focus trapping, Escape close and focus restoration. The footer uses Product, Company, Resources and Legal groups, dynamic year and responsible-risk language while omitting invented social, company, legal and partner details.

## Components and routes created

App-local components: `PublicShell`, `PublicHeader`, `PublicFooter`, `MarketingContainer`, `MarketingSection`, `MarketingSectionHeader`, `MarketingEyebrow`, `MarketingGrid`, `MarketingCard`, `MarketingCallout`, `MarketingCTA`, `LegalPageLayout`, `PublicPagePlaceholder` and `ActionLink`. Public layout/state files and all twelve routes listed above were created.

## Files changed

Created the `(public)` route tree and `public-shell` modules/tests; created `PUBLIC_WEBSITE_ARCHITECTURE.md`, `PUBLIC_ROUTE_INVENTORY.md`, and `PUBLIC_CONTENT_POLICY.md`; updated root metadata, authenticated route registry, roadmap, changelog, decisions, development rules, README, route/component inventories and 21st design context; removed the old root page/test and old authenticated Responsible Play route after migration.

## Commands executed

- Full pre-change repository verification matrix: passed.
- `21st search "premium analytics SaaS public header footer mobile drawer" --context auto`: unavailable because the local CLI is not authenticated; project primitives were used.
- Prettier write on changed app/design files: passed.
- Early `pnpm typecheck` and `pnpm test`: failed on stale generated types, shared-component prop names and test specificity; corrections recorded and rerun.
- Final command results are recorded below after verification.

## Accessibility verification

The public shell provides a keyboard-visible skip link, header/nav/main/footer landmarks, descriptive actions, text plus `aria-current` active indication, touch-sized controls, responsive stacking and reduced-motion handling. The shared Radix dialog primitive provides modal focus containment, Escape close and trigger restoration; tests exercise this behavior. Legal layouts constrain readable line length.

## Plan deviations

The authenticated Responsible Play route moved to `/settings/responsible-play` because Next.js route groups cannot own duplicate URLs. 21st catalog search could not authenticate, so no external component was installed. Final browser availability determines whether visual/browser-only criteria can be marked passed.

## Remaining risks and decision

The implementation contains no live data, authentication, payment, external calls or final Phase 2E landing content. Final status depends on the full automated matrix and live responsive/browser inspection; unavailable browser evidence is reported as an unresolved verification gap rather than inferred.
