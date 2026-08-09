# Public website architecture

## Route boundary

The `(public)` App Router group owns `/`, `/how-it-works`, `/performance`, `/pricing`, `/responsible-play`, `/about`, `/contact`, `/help`, `/privacy`, `/terms`, `/sign-in`, and `/sign-up`. Paths, metadata, header visibility, mobile visibility, and footer placement come from `public-shell/routes.ts`.

The route paths did not change during the visual rebuild. API routes, authentication mechanisms, app routes, and backend services remain outside this work.

## Shell

`PublicShell` supplies the skip link, sticky header, main landmark, scroll-reveal boundary, and footer. Desktop navigation exposes How it works, Performance, Pricing, and Responsible play. The solid mobile sheet exposes every informational public route and preserves focus trapping, Escape close, focus restoration, and safe-area spacing. Its hamburger uses a native, visible, solid-pink button rather than the shared icon-button text-hiding behavior.

The footer uses one product statement and a compact route index. It does not include unsupported social links, business addresses, partnerships, or contact details.

## Page composition

Every public page starts with `PageHero`, which pairs editorial copy with a factual status list over responsive football imagery. Its explicit `visual` variant selects analysis, archive, evidence, pipeline, or stadium artwork without making route content depend on filenames. Long pages use `SectionLead`, `NumberedList`, `StatusNotice`, `ContentGrid`, `ContentPanel`, `EmptyState`, and image figures to create a consistent reading rhythm without repeating generic card grids.

The homepage contains seven exported server components: `HomeHero`, `EngineeringFoundation`, `ValueAndCoverage`, `FeatureLaboratory`, `Workflow`, `Transparency`, and `TrustPlansFaq`. `EngineeringFoundation` continuously presents only verified repository technologies and explicitly disclaims partnerships. Despite the retained component name, `FeatureLaboratory` contains no demo or interactive product simulation. It presents sourced product questions and boundaries.

Legal pages share `LegalPageLayout`. They describe the processing that exists, retain `[Pending Legal Review]` where entity details are unresolved, and do not invent policy or contract terms. Account routes remain form-free because authentication has not been introduced.

The Help Centre is a focused Client Component that filters the committed article catalogue in memory. It does not call an AI service or search content that is not published. The Contact form calls a server action. The action validates, normalizes, removes disallowed control characters, rejects its honeypot field, and delegates persistence to a narrow server-only Supabase module.

## Rendering and behavior

Public content renders on the server. Focused client boundaries handle the header and mobile sheet, scroll reveals, the foundation carousel, Help Centre filtering, and Contact form submission state. There is no client state library, public sports-data cache, analytics script, or auth call in the public surface.

Contact persistence uses `@supabase/supabase-js` on the server with `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The service-role key is never exposed through `NEXT_PUBLIC_`. No anonymous browser key is configured because the current public surface makes no direct Supabase calls. The table has RLS enabled and forced, grants insert only to `service_role`, and defines no public policies. A missing configuration or failed insert produces a real failure state.

Three generated assets live under `public/images`: evidence review, the six-stage pipeline, and the results archive. They contain no operational data. Next.js image rendering provides responsive `sizes`; fixed aspect ratios prevent layout shift.

The design-system preview remains at `/design-system`, contains only the current visual specification, and is excluded from indexing.

## Verification

Public changes must pass the web typecheck, tests, lint, production build, placeholder scan, and browser checks at mobile and desktop sizes. Browser checks include focus order, mobile menu behavior, overflow, console errors, hydration errors, and reduced motion.
