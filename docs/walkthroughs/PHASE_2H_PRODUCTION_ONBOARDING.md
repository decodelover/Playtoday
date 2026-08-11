# Phase 2H Walkthrough Plan

## Phase 2G Retroactive Audit

Before proceeding with Phase 2H onboarding architecture, we audited the existing Phase 2G authentication system:

- **Supabase Authentication**: `apps/web/src/lib/supabase/client.ts` and `server.ts` trim environment keys and handle real session tokens via `@supabase/ssr`.
- **Auth Routes**: `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, `/verify` reside inside `apps/web/src/app/(auth)/` with proper responsive layouts and zero placeholder logic.
- **Session Protection**: `proxy-session.ts` and proxy middleware safeguard private routes and refresh session cookies.
- **Database User Profiles**: `supabase/migrations/20260810190000_phase_2g_profiles.sql` creates `public.profiles` tied to `auth.users(id)` with RLS policies and an `after insert` trigger (`on_auth_user_created`).
- **Secrets & Git Security**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safely exposed to browser JS while the service role key remains strictly server-side and excluded from client bundles.

---

## Current Database Assessment

Existing migrations in `supabase/migrations/`:

1. `20260809005815_phase_2f_contact_submissions.sql`: Public contact submission storage.
2. `20260810190000_phase_2g_profiles.sql`: `public.profiles` table (`id`, `display_name`, `avatar_url`, `created_at`, `updated_at`).

To support Phase 2H onboarding and user preferences without duplicating schema:

- Add `onboarding_completed_at` (timestamptz) and `onboarding_step` (text) columns to `public.profiles`.
- Create `public.user_preferences` table with RLS policies (`auth.uid() = user_id`) storing:
  - `preferred_sports` (text[], default `['football']`)
  - `preferred_bookmakers` (text[], default `['sportybet']`)
  - `preferred_markets` (text[], default `['1x2', 'double_chance', 'over_under']`)
  - `target_odds` (numeric, default 3.00)
  - `default_strategy` (text, default `'balanced'`)
  - `risk_preference` (text, default `'moderate'`)
  - `notification_channels` (jsonb, default `{"email": true, "in_app": true}`)
  - `responsible_play_ack` (boolean, default true)
  - `timezone` (text, default `'UTC'`)

---

## Skills Activation

We activate the required design and copy intelligence skills:

1. **Leonxlnx/taste-skill**: Guides visual elegance, asymmetric rhythm, dark luxury theme matching PlayToday brand tokens, step transitions, and anti-slop visual hierarchy.
2. **UI/UX Pro Max**: Guides multi-step form architecture, accessible fieldsets/legends, clear touch targets (`min 48px`), keyboard focus management, step indicator progress semantics, and responsive mobile stacking.
3. **Humanizer**: Ensures all user-facing copy (welcome messages, step titles, field labels, risk notices, validation warnings, and CTA buttons) reads naturally, devoid of robotic AI tropes or artificial hype.

---

## Onboarding Architecture

```
                                  +-----------------------+
                                  |  Authenticated User   |
                                  +-----------+-----------+
                                              |
                                              v
                               +--------------+--------------+
                               |  Server Onboarding Gate     |
                               |  Check profiles status      |
                               +--------------+--------------+
                                              |
                     +------------------------+------------------------+
                     |                                                 |
                     v                                                 v
      [onboarding_completed_at is null]                   [onboarding_completed_at exists]
                     |                                                 |
                     v                                                 v
        +------------+------------+                      +-------------+-------------+
        |   Route: /onboarding    |                      |   Redirect to: /overview   |
        +------------+------------+                      +---------------------------+
                     |
                     v
   +-----------------+-----------------+
   | Step 1: Welcome & Setup Intro     |
   | Step 2: Sports Selection          |
   | Step 3: Preferred Bookmakers      |
   | Step 4: Target Markets            |
   | Step 5: Target Odds & Strategy    |
   | Step 6: Notifications             |
   | Step 7: Responsible Play Setup    |
   | Step 8: Review & Persist          |
   +-----------------+-----------------+
                     |
                     v
        +------------+------------+
        | Save to user_preferences|
        | Set onboarding_completed|
        +------------+------------+
                     |
                     v
        +------------+------------+
        |   Redirect to: /overview|
        +-------------------------+
```

1. **Route Group**: `/onboarding` inside `apps/web/src/app/(app)/onboarding/`.
2. **Auth Gate**: Server-side layout check inspecting `public.profiles.onboarding_completed_at`.
   - Guest -> Redirect to `/sign-in`.
   - Incomplete User -> Allowed on `/onboarding`.
   - Completed User -> Redirected from `/onboarding` to `/overview`.
3. **Resilience & Resuming**: Saved steps are committed incrementally or retrieved from existing preferences on load so user refresh never loses state.

---

## Step-by-Step Execution Plan

### Step 1: Phase 2G Audit & Baseline Test Pass

- **Purpose**: Verify existing auth and profile system.
- **Files to Inspect**: `apps/web/src/lib/supabase/server.ts`, `apps/web/src/proxy.ts`.
- **Database Impact**: None.
- **Commands**: `pnpm --filter @playtoday/web test -- --pool=forks`

### Step 2: Database Schema & Migration for Onboarding

- **Purpose**: Create `20260811140000_phase_2h_onboarding.sql` adding onboarding fields to `profiles` and creating `public.user_preferences` table.
- **Files to Create**: `supabase/migrations/20260811140000_phase_2h_onboarding.sql`.
- **Database Impact**: Updates `profiles` table; creates `user_preferences` table with RLS policies (`auth.uid() = user_id`).

### Step 3: TypeScript Types & Zod Validation Schemas

- **Purpose**: Define canonical onboarding preferences schema with strict Zod validation.
- **Files to Create**: `packages/validation/src/onboarding.ts`, update `packages/database-types/src/database.ts`.

### Step 4: Onboarding State & Preference Server Actions

- **Purpose**: Create server-side procedures to read, update, and finalize user onboarding progress safely.
- **Files to Create**: `apps/web/src/app/actions/onboarding.ts`, `apps/web/src/lib/onboarding-service.ts`.

### Step 5: Onboarding UI Components & Multi-Step Wizard

- **Purpose**: Build responsive step wizard with progress indicators, fieldsets, keyboard controls, and Humanizer-reviewed text.
- **Files to Create**:
  - `apps/web/src/app/(app)/onboarding/page.tsx`
  - `apps/web/src/app/(app)/onboarding/onboarding-wizard.tsx`
  - `apps/web/src/app/(app)/onboarding/onboarding.module.css`
  - `apps/web/src/app/(app)/onboarding/steps/*`

### Step 6: Responsible-Play Integration & Risk Notices

- **Purpose**: Embed explicit responsible-play choices and risk disclaimers during step 7.
- **Files to Modify**: `apps/web/src/app/(app)/onboarding/steps/responsible-play-step.tsx`.

### Step 7: Final Completion & Redirection

- **Purpose**: Atomic update setting `onboarding_completed_at = now()` and redirecting to `/overview`.
- **Files to Modify**: `apps/web/src/app/actions/onboarding.ts`.

### Step 8: Quality Gates & Verification

- **Purpose**: Run all workspace quality checks (`format`, `typecheck`, `test`, `lint`, `build`).
- **Commands**: `pnpm quality`

---

## Security Risks & Mitigations

1. **User ID Spoofing**: User ID is derived exclusively from `auth.uid()` via Supabase RLS and server session token. Client-submitted `user_id` parameters are ignored.
2. **RLS Bypass Prevention**: `user_preferences` table requires `enable row level security` and `force row level security`. Policies strictly enforce `auth.uid() = user_id`.
3. **Invalid Preference Data**: All input parameters (odds range, market identifiers, bookmaker names) pass strict Zod validation before database insertion.
4. **Premature Completion**: `onboarding_completed_at` is only updated after all required preferences are successfully persisted inside a single transaction or verified database write.
5. **No Secret Exposure**: Supabase Service Role key remains server-side. Browser interactions execute through standard RLS-gated client tokens.

---

## Completion Conditions

Phase 2H passes when:

- [x] Phase 2G authentication is verified.
- [x] Database migration creates `public.user_preferences` and adds onboarding columns to `public.profiles`.
- [x] RLS policies protect user preferences for SELECT, INSERT, and UPDATE using `auth.uid()`.
- [x] `/onboarding` route gates unauthenticated guests and redirects completed users to `/overview`.
- [x] Multi-step onboarding collects real supported preferences (Football, SportyBet/Bet9ja/MSport, Target Odds, Strategy, Risk, Notifications, Responsible Play).
- [x] Resuming interrupted onboarding restores previous choices.
- [x] Final completion sets `onboarding_completed_at` atomically and redirects to `/overview`.
- [x] All 95+ unit tests pass, typecheck has 0 errors, ESLint has 0 warnings, and `pnpm build` succeeds.
- [x] Documentation is saved to `docs/walkthroughs/PHASE_2H_PRODUCTION_ONBOARDING.md`, `docs/ONBOARDING_ARCHITECTURE.md`, `docs/USER_PREFERENCES.md`, and `docs/ONBOARDING_SECURITY.md`.
