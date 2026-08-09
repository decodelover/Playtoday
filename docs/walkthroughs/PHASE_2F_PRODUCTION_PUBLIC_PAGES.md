# Revised Phase 2F production public pages

## Outcome

Revised Phase 2F is implemented in the repository. The public supporting pages use the existing PlayToday shell, hero compositions, design tokens, navigation, and responsive layout rules. They publish no invented sports records, prices, people, partners, or performance claims.

The code and repository checks pass. A real Supabase project is now configured in the ignored root `.env.local`, and its Data API responds successfully. The migration has not been applied because the workspace still has no project-management or database credential for the Supabase CLI and Docker is not installed. Database-level pgTAP tests therefore remain unexecuted. The remote Data API does not currently expose `contact_submissions`, so the Contact form continues to fail honestly instead of reporting a false success.

## Skills and design direction

The implementation used the installed Leonxlnx taste skill, UI/UX Pro Max, and Humanizer guidance. The result retains the established deep navy, action pink, mint, lavender, and cloud system rather than replacing the current public identity. Content uses short, direct sentences, sentence-case headings, and explicit limits.

## Group 1: frontend structure

- Extended `PageHero` with explicit analysis, archive, evidence, pipeline, and stadium visual variants.
- Added `ContentGrid`, `ContentPanel`, and `EmptyState` to the public composition grammar.
- Preserved the current public routes, shell, navigation, footer, scroll reveal, mobile sheet, and responsive breakpoints.
- Corrected the odd three-item fact-list layout at the narrow breakpoint.

Primary files:

- `apps/web/src/app/public-shell/marketing.tsx`
- `apps/web/src/app/public-shell/marketing.test.tsx`
- `apps/web/src/app/public-shell/shell.module.css`

## Group 2: page content

- How It Works explains source validation, the AI Analyst boundary, target odds, and settlement transparency.
- Pricing names Free, Plus, Pro, and Elite and states `Pricing has not been finalized.` It has no checkout or fabricated prices.
- Responsible Play states 18+, high odds mean high risk, no martingale, and no chasing losses.
- About describes the mission without inventing a team, office, investor, or launch history.
- Privacy and Terms describe the current processing boundary, state that PlayToday is not a bookmaker, make no outcome guarantee, assign responsibility to the user, and retain `[Pending Legal Review]` for unresolved entity details.

Primary files:

- `apps/web/src/app/(public)/how-it-works/page.tsx`
- `apps/web/src/app/(public)/pricing/page.tsx`
- `apps/web/src/app/(public)/responsible-play/page.tsx`
- `apps/web/src/app/(public)/about/page.tsx`
- `apps/web/src/app/(public)/privacy/page.tsx`
- `apps/web/src/app/(public)/terms/page.tsx`
- `apps/web/src/app/(public)/supporting-pages.test.tsx`
- `apps/web/src/app/public-shell/routes.ts`

## Group 3: public data and Help Centre

- Verified Performance displays exactly: `No verified PlayToday performance records have been published yet.`
- No graph, rate, result, sample, or chart is rendered because the repository has no verified performance read model.
- The Help Centre publishes categories for Getting Started, Sports Analysis, Target Odds, Daily Edge, Settlement, Plans and Pricing, and Responsible Play.
- Search filters only the committed article catalogue. No chatbot, remote search, or synthetic response exists.

Primary files:

- `apps/web/src/app/(public)/performance/page.tsx`
- `apps/web/src/app/(public)/help/page.tsx`
- `apps/web/src/components/public/help/help-content.ts`
- `apps/web/src/components/public/help/help-search.tsx`
- `apps/web/src/components/public/help/help-search.test.tsx`
- `apps/web/src/components/public/help/help.module.css`

## Group 4: Contact and Supabase foundation

The Contact form has visible labels, field limits, an enquiry type selector, a honeypot, pending state, and textual success or failure feedback. The server action validates with Zod, trims and normalizes text, removes disallowed control characters, checks the honeypot, and writes only through the server persistence module. It reports success only after Supabase confirms the insert.

The migration creates `contact_submissions` with:

- `id`
- `enquiry_type`
- `name`
- `email`
- `subject`
- `message`
- `status`
- `created_at`

RLS is enabled and forced. `public`, `anon`, and `authenticated` receive no table access. `service_role` receives insert only. No public policy exists.

Primary files:

- `apps/web/src/app/(public)/contact/page.tsx`
- `apps/web/src/app/(public)/contact/actions.ts`
- `apps/web/src/app/(public)/contact/actions.test.ts`
- `apps/web/src/components/public/contact/contact-form.tsx`
- `apps/web/src/components/public/contact/contact-form-state.ts`
- `apps/web/src/components/public/contact/contact-form.test.tsx`
- `apps/web/src/components/public/contact/contact-schema.ts`
- `apps/web/src/components/public/contact/contact-schema.test.ts`
- `apps/web/src/components/public/contact/persist-contact.ts`
- `apps/web/src/components/public/contact/contact.module.css`
- `apps/web/src/lib/supabase/contact-client.ts`
- `apps/web/src/lib/supabase/contact-migration.test.ts`
- `apps/web/src/env/schema.ts`
- `packages/database-types/src/database.ts`
- `supabase/config.toml`
- `supabase/migrations/20260809005815_phase_2f_contact_submissions.sql`
- `supabase/tests/database/contact_submissions.test.sql`

## Migration record

- Supabase CLI initialized locally: yes.
- Migration created: yes.
- Migration applied locally: no. Docker is not installed.
- Remote Data API reachable: yes, verified with HTTP 200 on 2026-08-09.
- Remote `contact_submissions` exposure: no.
- Migration applied remotely: no. The supplied project URL and service-role API key do not authorize Supabase CLI migrations.
- pgTAP tests executed against PostgreSQL: no.
- Static migration contract tests: pass.

Before release, an authorized operator must link the intended Supabase environment, review the target, run the migration, generate database types from that database, execute `supabase/tests/database/contact_submissions.test.sql`, and verify a real Contact submission end to end.

## Test results

Run on 2026-08-09:

| Command             | Result                                              |
| ------------------- | --------------------------------------------------- |
| `pnpm format:check` | PASS                                                |
| `pnpm lint`         | PASS, 9 workspaces and Ruff                         |
| `pnpm typecheck`    | PASS, 9 workspaces                                  |
| `pnpm test`         | PASS, 66 web tests, 32 UI tests, and 3 Python tests |
| `pnpm build`        | PASS, all 30 routes generated                       |

The first production build found an undefined Contact action state during prerendering. The shared state contract was moved out of the `use server` module so that module exports only the async action. The two affected tests, web type check, and full production build passed after the correction.

## Open release gates

- Apply the migration to an approved Supabase environment.
- Run the database-level pgTAP suite and verify public deny behavior against PostgreSQL.
- Generate the database types from the applied schema instead of relying only on the migration-aligned local contract.
- Supply a Supabase CLI access token plus database credentials, or apply the reviewed SQL through the Supabase SQL editor.
- Submit the Contact form against that environment and confirm the stored row and user-facing success state.
- Complete legal review of Privacy and Terms placeholders.
