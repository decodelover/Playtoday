# Phase 2C Application Shell Walkthrough

## Original plan

The visible plan covered the Phase 2B audit, existing routes, route group, typed registry, desktop/collapsed sidebar, header, mobile navigation and drawer, breadcrumbs, content layout, shell states, accessibility, placeholders, tests, documentation, and final verification. All feature and integration work was excluded.

## Repository state before changes

Phases 1, 2A, and 2B passed frozen installation, environment, formatting, lint, type, test, coverage, build, quality, CI, Ruff, and Pytest checks. `@playtoday/ui` supplied the required tokens and accessible primitives. Only `/`, `/design-system`, and `/api/health` existed; no dashboard, authentication, Supabase, sports data, or external integration existed.

## Shell architecture and navigation model

The `(app)` route group uses a server layout around a focused route-aware `AppShell` client boundary. Central CSS controls shell dimensions and safe areas. Wide screens use the grouped sidebar, tablet/compact widths its collapsed form, and narrow screens five labelled bottom destinations plus a Sheet drawer. One typed registry supplies all route metadata and matching.

## Components created

`AppShell`, route registry/matcher, `NavigationList`, `RouteBreadcrumbs`, `MobileNavDrawer`, `AppHeader`, `MobileBottomNav`, `RouteIcon`, `PagePlaceholder`, and route-group loading/error states. All route-aware components remain app-local.

## Routes created

`/overview`, `/ai-analyst`, `/games`, `/daily-odds`, `/target-odds`, `/markets`, `/selections`, `/analytics`, `/history`, `/notifications`, `/subscription`, `/responsible-play`, `/settings`, and `/support`. Every route is a shell placeholder.

## Files changed and commands executed

Created shell modules, route-group files, tests, application-shell documentation, route inventory, and this walkthrough; updated global styles and project records. No dependency changed. Commands include the complete prescribed Node/Python suites, focused web checks, Prettier, build, 21st search/review, scans, and runtime probes where available.

## Accessibility verification

Tests cover navigation uniqueness, `aria-current`, collapsed names, five labelled mobile destinations, header action names, skip-link target, landmarks, breadcrumb semantics, drawer focus entry, Escape dismissal, route-selection close, and restoration. CSS covers visible focus, touch targets, safe areas, reduced motion, and forced colors.

## Plan deviations

- The attachment had to be read before its embedded first-visible-response rule could be discovered; no repository change occurred before the plan.
- 21st catalog search required authentication, so established project context and components were used.
- The old roadmap used 2C for an unstarted Python-runtime step; the explicitly authorized shell now occupies Phase 2C and unstarted runtime work shifts later.

## Remaining risks

No browser instance was connected, so live screenshots and console inspection could not run. Deterministic interaction tests, production rendering, and HTTP probes passed. Icons are lightweight and provisional pending a justified icon-system decision.

## Final decision

PHASE 2C DOES NOT PASS — NOT READY FOR PHASE 2D. Implementation and automated verification pass, but mandatory live-browser console and viewport verification could not run because no browser instance was available.
