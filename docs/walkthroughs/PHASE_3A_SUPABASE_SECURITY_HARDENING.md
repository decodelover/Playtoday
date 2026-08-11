# Phase 3A Walkthrough Plan

## Current Supabase architecture assessment

The audit covers the repository, Supabase configuration, migrations, Auth clients, session proxy, service-role boundary, profiles, onboarding, preferences, contact submissions, static Help Centre content, functions, triggers, policies, grants, constraints, indexes, and Realtime configuration. Repository code and executable checks are evidence; earlier completion reports are context only.

## Phase 2F-2H retroactive audit

Phase 2F created a private contact table and a server-only insert path. Phase 2G created Supabase SSR Auth, protected routes, profiles, RLS, and an Auth trigger. Phase 2H added preferences, onboarding routing, draft persistence, and completion state.

The audit found these blocking weaknesses:

- Profile update access included server-controlled onboarding columns.
- Completion used two independent writes while documentation called it atomic.
- Signup created a preference row with responsible-play acknowledgement set to true.
- Public definer trigger functions had no fixed `search_path` or execution revocation.
- Preference values had incomplete database constraints.
- Profile and preference Data API grants were implicit.
- RLS policies did not name their target role.
- Onboarding actions could return raw database messages.
- No database attack matrix existed for profiles and preferences.

The Phase 3A migration and application changes correct these issues without replacing the working Auth or onboarding systems.

## Environment and secret safety audit

The active file declares a development environment and points at a custom Supabase URL. It is ignored and untracked. The service-role key is present only in the local server environment and the `server-only` contact client. Tracked-file and history-safe scans found no credential-shaped value or committed `.env` file.

The repository is not linked to a Supabase project, and the target cannot be classified as local, staging, or production from repository evidence. Docker, Podman, and `psql` are unavailable. No remote database-changing command is permitted under this uncertainty.

## Migration audit

Four ordered migrations now exist. The first three create contact submissions, profiles, and preferences. The fourth is additive hardening created by the installed CLI. It contains no table truncation, production reset, Auth user deletion, or fake data. It removes obsolete trigger functions only after removing their triggers and replaces them in the same transaction.

Remote migration history and schema drift remain unverified until a linked, explicitly identified target is available.

## RLS audit

All three public tables have RLS enabled and forced. Contact submissions expose no public policy. Profiles and preferences use explicit `TO authenticated` self-ownership policies. Anonymous roles have no table grants. Profile update grants contain only public profile fields. Preference grants contain only user-editable fields. Delete is intentionally unavailable.

## Data ownership model

- Profiles: `profiles.id = auth.uid()`.
- Preferences and onboarding: `user_preferences.user_id = auth.uid()`; public RPCs derive the ID internally.
- Notifications: the current email and in-app booleans live inside the owned preference row.
- Contact submissions: system-owned and written only by the server contact client.
- Future private prediction history: private by default and requires a separate ownership model before implementation.

## Database integrity strategy

Primary keys guarantee one profile and one preference row per user. Foreign keys cascade account-owned profile and preference deletion. Check constraints enforce canonical identifiers and structured values. UTC `timestamptz` fields are used throughout. One trigger function maintains `updated_at`. Onboarding upserts and completion are idempotent. Completion and preferences share one transaction.

## Step-by-step execution plan

| #   | Purpose                | Current risk            | Inspect                | Create                     | Modify                   | Objects              | Commands or tools        | Expected result              |
| --- | ---------------------- | ----------------------- | ---------------------- | -------------------------- | ------------------------ | -------------------- | ------------------------ | ---------------------------- |
| 1   | Repository audit       | hidden architecture     | tree, scripts, Git     | notes                      | none                     | all                  | `rg`, Git                | factual baseline             |
| 2   | Phase 2 audit          | regressions             | Phase 2 code and tests | regression tests if needed | blockers only            | existing objects     | baseline tests           | working systems reused       |
| 3   | Secret audit           | credential exposure     | env and imports        | security tests/docs        | boundaries if needed     | none                 | safe scans               | no client secret             |
| 4   | Migration inventory    | ordering or drift       | migration directory    | policy doc                 | none                     | migrations           | CLI help/list            | ordered source of truth      |
| 5   | Schema inventory       | unknown objects         | migration SQL          | inventory doc              | none                     | schema               | static/catalog review    | complete inventory           |
| 6   | RLS inventory          | permissive access       | grants and policies    | RLS doc                    | migration                | policies             | pgTAP                    | explicit matrix              |
| 7   | Function inventory     | unsafe elevation        | SQL functions          | inventory                  | migration                | functions            | SQL review               | justified modes              |
| 8   | Ownership review       | spoofed IDs             | actions and RLS        | tests                      | services                 | ownership            | attack tests             | session-derived owner        |
| 9   | Profile integrity      | privileged mutation     | profiles               | tests                      | grants/policies          | profiles             | pgTAP                    | public fields only           |
| 10  | Onboarding integrity   | partial completion      | service and schema     | RPC/tests                  | service                  | profiles/preferences | unit/DB tests            | atomic completion            |
| 11  | Public/private review  | field leakage           | views/routes           | docs                       | none                     | none                 | inventory                | no database public surface   |
| 12  | Contact security       | enquiry disclosure      | contact path           | tests                      | none                     | contact table        | role tests               | server insert only           |
| 13  | Constraints            | invalid values          | schemas and Zod        | tests                      | migration                | checks               | local replay             | invalid writes rejected      |
| 14  | Foreign keys           | orphans                 | relationships          | docs                       | none                     | foreign keys         | schema review            | deliberate cascade           |
| 15  | Indexes                | waste or slow ownership | queries and PKs        | docs                       | none                     | indexes              | review                   | no speculative index         |
| 16  | Timestamps             | stale updates           | timestamp columns      | reusable trigger           | migration                | triggers             | DB tests                 | UTC and automatic updates    |
| 17  | Function safety        | escalation              | all functions          | tests                      | migration                | functions/grants     | advisors/tests           | fixed search path            |
| 18  | Trigger safety         | duplicates              | all triggers           | tests                      | migration                | triggers             | repeated insert          | one canonical path           |
| 19  | Service role           | RLS bypass              | call sites             | usage doc                  | none                     | contact grant        | import scan              | one justified use            |
| 20  | Realtime               | row leakage             | config/subscriptions   | tests/docs                 | none                     | publication          | catalog test             | private tables unpublished   |
| 21  | Account lifecycle      | unsafe states           | profile fields         | docs                       | none                     | none                 | review                   | active-only model documented |
| 22  | Audit foundation       | missing trace           | privileged actions     | docs                       | none                     | none                 | threat review            | table deferred honestly      |
| 23  | Retention              | unsafe deletion         | tables/FKs             | policy doc                 | none                     | none                 | review                   | unresolved periods recorded  |
| 24  | Error handling         | raw SQL errors          | server actions         | tests                      | actions/service          | none                 | unit tests               | stable user errors           |
| 25  | Migration hardening    | deploy risk             | findings               | additive migration         | types                    | affected objects     | CLI migration new        | reviewable SQL               |
| 26  | RLS tests              | unproved policies       | test setup             | pgTAP                      | none                     | policies             | `supabase test db`       | matrix passes locally        |
| 27  | Cross-user tests       | IDOR                    | owned tables           | User A/B cases             | none                     | policies             | pgTAP                    | denial in both directions    |
| 28  | Anonymous tests        | public leakage          | all tables/functions   | anon cases                 | none                     | grants               | pgTAP                    | intended denial              |
| 29  | Server tests           | excess privilege        | service call sites     | grant cases                | none                     | grants               | pgTAP/unit               | narrow elevation             |
| 30  | Migration verification | syntax or drift         | config/history         | none                       | corrections              | schema               | reset/lint/advisors/diff | reproducible schema          |
| 31  | Regression tests       | Phase 2 breakage        | Auth/onboarding/public | missing cases              | fixes                    | none                 | pnpm suite               | prior behavior preserved     |
| 32  | Documentation          | unauditable design      | required docs          | inventories/policies       | roadmap and architecture | none                 | format check             | docs match code              |
| 33  | Final readiness        | hidden failure          | full diff              | report                     | corrections              | all                  | quality and CI           | evidence-backed result       |

## Security risks

The implementation addresses service-role exposure, missing or permissive RLS, cross-user access, user-controlled ownership, role escalation, definer functions, unsafe search paths, orphaned account data, duplicate preferences, cascade deletion, anonymous leakage, unsafe views, Realtime exposure, destructive migrations, trigger duplication, privileged profile fields, and sensitive logging.

Remote drift, production data compatibility, and executable database behavior remain risks until the pgTAP suite and migration replay run in an isolated stack and the intended hosted target is identified.

## Scope exclusions

Phase 3A does not implement a new Auth system, onboarding redesign, account deletion UI, payments, charging, provider ingestion, prediction models, settlement, bookmaker APIs, AI Analyst backend, admin dashboard, speculative Realtime, or unused lifecycle states.

## Completion conditions

Repository implementation is complete when the additive migration, application wiring, attack tests, regression tests, and required documents are present and quality checks pass. Production readiness also requires local migration replay, pgTAP, database lint, advisors, reviewed schema diff, remote migration comparison, and confirmation that the deployment target is not an unidentified production database.
