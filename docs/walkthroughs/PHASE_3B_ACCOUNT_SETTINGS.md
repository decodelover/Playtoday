# Phase 3B Walkthrough Plan

## Phase 3A retroactive audit

Phase 3B reuses the three existing public tables, forced RLS policies, canonical Auth profile trigger, transaction-safe onboarding functions, and server-only contact client. The working tree contains the complete Phase 3A implementation, including its 40-assertion pgTAP suite. Database execution and remote drift checks remain unverified because the current machine has no Docker, Podman, or `psql`, and the repository is not linked to an identified Supabase project. Phase 3B will preserve this work and rerun every available check.

## Current account and settings assessment

`/settings`, `/notifications`, `/settings/responsible-play`, and `/subscription` are placeholders. There are no profile, preferences, security, privacy, export, or deletion pages. The account menu has no real identity data. Signed-in password management is absent. Sign-out uses Supabase's default global scope without explaining it. There is no trusted device list, security-event source, MFA enforcement, avatar storage, billing record, or lifecycle state. Settings must read the existing profile and preference records rather than creating another storage model.

## Skills activation

The Leonxlnx Taste Skill is used in preserve mode for hierarchy, spacing, restrained containers, and visual consistency. It explicitly excludes dense product settings, so UI/UX Pro Max governs navigation, forms, feedback, destructive confirmation, responsive behavior, and accessibility. Humanizer governs every customer-facing string. Supabase guidance governs Auth, sessions, RLS, migrations, and privileged operations.

Design read: an authenticated sports-intelligence settings area for real account holders, with a calm trust-first product language and the existing PlayToday system. Dials are variance 4, motion 2, and density 6.

## Settings information architecture

Canonical routes are `/settings`, `/settings/profile`, `/settings/preferences`, `/settings/notifications`, `/settings/security`, `/settings/responsible-play`, and `/settings/privacy`. `/notifications` redirects to the canonical notification settings page. `/subscription` remains separate and truthful because billing is outside Phase 3B. A compact settings subnavigation sits inside the existing authenticated shell and adapts to a labelled horizontal control on mobile.

## Security architecture

Password changes use Supabase Auth with current-password verification when supported. Passwords never enter logs or server-action responses. Session controls expose only real scopes: current device, other sessions, and all sessions. No device, location, IP, or activity history is fabricated. MFA stays absent until enrollment, login challenge, and server/RLS enforcement exist. Sensitive operations use explicit confirmation and safe error messages.

## User data architecture

Profiles come from `public.profiles`; identity comes from the authenticated Supabase user; preferences come from `public.user_preferences` and remain shared with onboarding. A secure export may return current-user Auth identity, profile, and preferences directly as JSON without a public file. Account deletion is exposed only if reauthentication, retention, cascade behavior, and the server-only admin boundary are defensible. Contact submissions remain system-owned because they have no authenticated-user foreign key.

## Step-by-step execution plan

| #   | Purpose               | Current risk                 | Inspect                     | Create                | Modify            | Objects               | Dependencies         | Commands              | Expected result        |
| --- | --------------------- | ---------------------------- | --------------------------- | --------------------- | ----------------- | --------------------- | -------------------- | --------------------- | ---------------------- |
| 1   | Verify Phase 3A       | Database tests were blocked  | migrations, pgTAP, RLS docs | audit notes           | blockers only     | existing objects      | Supabase CLI         | tests, status         | factual status         |
| 2   | Audit settings routes | placeholders and duplication | app routes, shell           | route map             | route files       | none                  | Next.js              | `rg`                  | one route model        |
| 3   | Define settings IA    | fragmented navigation        | route metadata              | subnavigation         | shell routes      | none                  | existing UI          | route tests           | deep links             |
| 4   | Build profile page    | no account UI                | profile schema, Auth        | page and form         | settings index    | none                  | existing UI          | web tests             | real data shown        |
| 5   | Persist profile       | ownership spoofing           | RLS, server client          | action/service        | validation        | none initially        | Supabase SSR         | tests                 | session-derived write  |
| 6   | Show identity         | fake/mutable email           | Auth user                   | identity section      | profile page      | none                  | Supabase Auth        | tests                 | read-only identity     |
| 7   | Change password       | missing signed-in flow       | reset flow, Auth docs       | password form         | security page     | none                  | supabase-js          | Auth tests            | real update            |
| 8   | Audit sessions        | fake device risk             | Auth session APIs           | capability notes      | security service  | none                  | supabase-js          | type/docs review      | real scopes only       |
| 9   | Build security page   | no controls                  | Auth and shell              | page/forms            | settings nav      | none                  | existing UI          | tests                 | working controls       |
| 10  | Handle activity       | no trusted source            | audit docs                  | honest empty state    | security page     | none                  | none                 | copy tests            | no fake events         |
| 11  | Edit sports           | duplicate storage            | onboarding schema           | preference form       | service           | existing row          | validation           | tests                 | football-only truth    |
| 12  | Edit bookmakers       | invalid IDs                  | canonical constants         | section               | preference action | existing checks       | validation           | tests                 | valid values           |
| 13  | Edit markets          | divergent IDs                | canonical constants         | section               | preference action | existing checks       | validation           | tests                 | canonical values       |
| 14  | Edit target odds      | misleading risk              | odds schema                 | numeric field         | action            | existing check        | Zod                  | tests                 | bounded value          |
| 15  | Edit risk/style       | duplicate terms              | canonical constants         | selection controls    | action            | existing columns      | Zod                  | tests                 | canonical values       |
| 16  | Edit notifications    | fake channels                | JSON schema                 | page/form             | legacy route      | existing JSON         | Zod                  | tests                 | email/in-app only      |
| 17  | Responsible Play      | cosmetic controls            | acknowledgement             | truthful page         | settings nav      | existing boolean      | none                 | tests                 | no fake controls       |
| 18  | Build privacy page    | opaque storage               | schema, policies            | privacy page          | settings nav      | none                  | none                 | tests                 | factual inventory      |
| 19  | Export data           | data leakage                 | allowed fields              | export action/route   | privacy page      | none                  | server client        | attack tests          | scoped JSON            |
| 20  | Decide deletion       | irreversible loss            | retention, cascades         | policy or safe flow   | privacy page      | only if justified     | admin Auth           | tests/docs            | real or absent         |
| 21  | Handle lifecycle      | invented states              | profile schema              | architecture notes    | privacy copy      | none                  | none                 | review                | active-only truth      |
| 22  | Integrate menu        | generic account trigger      | shell, user loader          | identity component    | layout/shell      | none                  | React                | shell tests           | real name/email        |
| 23  | Humanize copy         | robotic messages             | visible strings             | none                  | account UI        | none                  | Humanizer            | text scan             | calm copy              |
| 24  | Refine responsive UI  | squeezed desktop layout      | CSS, shell widths           | responsive styles     | settings CSS      | none                  | CSS                  | browser widths        | deliberate mobile UI   |
| 25  | Review accessibility  | form/focus defects           | controls, dialogs, nav      | tests                 | markup/CSS        | none                  | Testing Library      | keyboard tests        | labelled UI            |
| 26  | Review RLS            | cross-user writes            | policies/actions            | attack cases          | pgTAP if needed   | policies if defective | Supabase             | pgTAP/static tests    | isolation              |
| 27  | Add tests             | unproved flows               | Vitest setup                | settings/action tests | route tests       | fixtures only         | Vitest               | focused/full tests    | regression coverage    |
| 28  | Browser verification  | runtime defects              | running app                 | screenshots if useful | fixes             | none                  | browser tool         | dev server            | responsive proof       |
| 29  | Document architecture | unaudited decisions          | existing docs               | four required docs    | roadmap/policies  | none                  | Markdown             | format check          | current docs           |
| 30  | Final verification    | hidden release failure       | full diff                   | report                | corrections       | all changes           | repository toolchain | quality, CI, Supabase | decision with evidence |

## Security risks

The implementation must prevent cross-user profile edits, client-spoofed ownership, privileged-field mutation, unsafe email changes, password leakage, raw backend errors, fake sessions, deletion bypass, destructive cascades, export leakage, service-role misuse, stale state, notification spoofing, cosmetic Responsible Play controls, race conditions, and duplicate writes. Ownership comes from the authenticated session. RLS and database constraints remain the primary boundaries.

## Scope exclusions

Phase 3B does not implement billing, subscription charging, provider ingestion, prediction models, settlement, bookmaker APIs, AI Analyst services, an admin dashboard, fake session history, speculative security events, unsupported push notifications, biometrics, passkeys, trusted-device lists, or cosmetic Responsible Play enforcement. MFA remains absent unless the full enrollment, challenge, login, and enforcement architecture can be completed safely.

## Completion conditions

Phase 3B passes only if Phase 3A security can be verified, settings read and persist real authenticated data, password/session controls use actual Supabase capabilities, preferences remain shared with onboarding, export/deletion are secure and real or absent, cross-user access fails, copy is humanized, accessibility and responsive checks pass, documentation is complete, and every repository, Supabase, test, build, quality, and CI gate passes.

## Execution status

Implementation completed the canonical routes, authenticated profile and preference actions, read-only email identity, real password update, supported session scopes, truthful security and Responsible Play states, scoped JSON export, and account-menu integration. Account deletion was deliberately not exposed because retention and related-data policy are unresolved. Phase 3B added no database migration or service-role path.

Repository checks, local CI, and static attack tests pass. Local migration replay and pgTAP remain blocked because no Docker-compatible runtime is installed. Authenticated browser persistence and remote drift verification remain blocked until the Supabase CLI is authenticated and linked to the intended project. These are release blockers under the completion conditions above.
