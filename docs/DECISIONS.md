# PlayToday Architecture Decisions

## ADR 011: Sports ingestion runtime and access boundary

- **Context**: The sports domain package existed, but the Python worker was a placeholder and hosted Supabase had no sports schema.
- **Decision**:
  - Run ingestion in Node.js so the worker directly composes `ApiFootballAdapter` and `SportsIngestionPersistence`.
  - Use Vercel, the existing approved production platform, for one protected daily cron route.
  - Keep API-Football and service-role credentials server-only.
  - Give authenticated members read-only canonical access. Keep provider mappings, payloads, health, and run history internal.
  - Limit Free-plan runs by request and fixture budgets. Do not enable frequent live polling at the verified quota.
- **Consequences**: Manual and scheduled hosted ingestion are operational. The production route is secret-protected, quota-bounded, and verified against the canonical hosted database. Higher-frequency live polling remains deferred until quota and runtime capacity are approved.

## ADR 010: Canonical authenticated account settings and safe lifecycle boundaries

- **Context**: Members needed account controls without duplicated preferences, fabricated security data, or privileged RLS bypasses.
- **Decision**:
  - Consolidate account management under `/settings/*` and redirect the former notification route.
  - Read Auth identity, profile, and the existing onboarding preference record server-side.
  - Derive every write owner from `auth.getUser()` and use the normal member session plus RLS.
  - Use Supabase Auth for password updates and supported session-revocation scopes.
  - Provide a direct authenticated JSON export, with no generated public file.
  - Keep email changes, MFA, security activity, enforced account restrictions, and self-service deletion absent until their complete security and retention models exist.
- **Consequences**: Settings remain truthful and share one source of preference data. Account deletion and additional security capabilities require separate reviewed architecture rather than cosmetic controls.

## ADR 009: Database ownership and onboarding transaction boundary

- **Context**: Phase 2H allowed members to update all columns on their own profile and completed onboarding with two separate Data API writes.
- **Decision**:
  - Keep profile and preference tables, but restrict normal profile updates to `display_name` and `avatar_url`.
  - Derive onboarding ownership inside narrow authenticated PostgreSQL functions using `auth.uid()`.
  - Persist draft step plus preferences, and final preferences plus completion, in single transactions.
  - Keep trigger-only code in a locked `private` schema with an empty `search_path`.
  - Keep contact insertion as the only application service-role use.
- **Consequences**: Members cannot forge completion through direct profile updates. Settings can still edit preference columns through RLS. Database migration and pgTAP verification are required before deployment.

## ADR 008: User Onboarding State & Preference Persistence Strategy

- **Context**: Newly authenticated users require preference configuration (bookmaker formatting, target odds range, risk profile, responsible-play acknowledgement).
- **Decision**:
  - Store onboarding completion timestamp (`onboarding_completed_at`) and step progress (`onboarding_step`) directly on `public.profiles`.
  - Store sports intelligence preferences in `public.user_preferences` table protected by RLS (`auth.uid() = user_id`).
  - Perform server-side route gating in `(app)/layout.tsx` to redirect incomplete members to `/onboarding`.
  - Save progress incrementally through the atomic `save_onboarding_progress` RPC so browser refresh restores exact step state.
