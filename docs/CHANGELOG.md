# PlayToday Changelog

## [Phase 2H] - 2026-08-11

### Added

- **Production User Onboarding & Preferences**: Implemented `/onboarding` multi-step wizard for newly registered members.
- **Database Schema & RLS**: Created `supabase/migrations/20260811140000_phase_2h_onboarding.sql` creating `public.user_preferences` table and adding `onboarding_completed_at` / `onboarding_step` to `public.profiles`.
- **Server Gating & Resuming**: Added server-side layout protection redirecting incomplete members to `/onboarding` and completed members to `/overview`.
- **Validation & Canonical Preferences**: Created `@playtoday/validation` onboarding schema with canonical definitions for Sports, Bookmakers, Markets, Target Odds, Strategy, Risk, and Responsible Play.
- **Documentation**: Created `ONBOARDING_ARCHITECTURE.md`, `USER_PREFERENCES.md`, and `ONBOARDING_SECURITY.md`.
