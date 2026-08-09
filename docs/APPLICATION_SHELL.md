# Application Shell

## Purpose

Phase 2C establishes PlayToday’s responsive, route-aware application frame without authentication, live data, or feature behavior.

## Route architecture and navigation

Future authenticated pages live in the App Router `(app)` route group, keeping public URLs clean. `/overview` is the shell entry. A central typed registry defines Primary, Predictions, Performance, and Account destinations and supplies the sidebar, bottom navigation, drawer, breadcrumbs, and placeholders.

Wide displays use an expanded sidebar. Compact laptop and tablet widths use its accessible collapsed form. Manual collapse is session-local until a user-preference model exists. Narrow screens use five labelled, safe-area-aware destinations plus a complete Sheet drawer.

## Header and breadcrumbs

The sticky header contains route-derived breadcrumbs and accessible Search PlayToday, Notifications, and Account actions. Search explains that it is unavailable; other actions lead only to placeholders. No counts, identities, or plan claims are shown.

## Accessibility and responsive content

The shell provides a focus-revealed skip link, labelled landmarks, `aria-current="page"`, visible focus, minimum touch targets, reduced-motion and forced-colors behavior, drawer focus trapping, Escape dismissal, and explicit focus restoration. Central variables control sidebar and bottom-navigation offsets. Main content uses design-system gutters, safe-area clearance, and overflow protection.

## Client and server boundaries

Pages and placeholder composition are server components. `AppShell` is the focused client boundary for pathname awareness, sidebar state, dialogs, menus, and the drawer. It performs no API call and uses no global state library. Next.js routing remains in `apps/web`; generic primitives remain in `@playtoday/ui`.

## Placeholder policy and future integrations

Shell routes show a PageHeader, foundation badge, and one neutral card. They may not show live fixtures, odds, selections, codes, operational metrics, identities, or guaranteed claims. Authentication may later guard `(app)` without changing URLs. Subscription gating must remain server-controlled. Administration requires a separate shell.

## Adding or removing a route

Update `routes.ts`, create or remove the page, update `ROUTE_INVENTORY.md`, review all navigation surfaces, and run shell tests. Do not duplicate labels or add permission/subscription fields before their authorized phases.

## Testing expectations

Protect unique keys/paths, intended mobile destinations, nested matching, current-page semantics, collapsed labels, header action names, drawer focus, skip-link target, breadcrumbs, placeholder copy, responsive offsets, and all repository quality gates.
