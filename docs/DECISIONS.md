# PlayToday Architecture Decisions

## ADR 008: User Onboarding State & Preference Persistence Strategy

- **Context**: Newly authenticated users require preference configuration (bookmaker formatting, target odds range, risk profile, responsible-play acknowledgement).
- **Decision**:
  - Store onboarding completion timestamp (`onboarding_completed_at`) and step progress (`onboarding_step`) directly on `public.profiles`.
  - Store sports intelligence preferences in `public.user_preferences` table protected by RLS (`auth.uid() = user_id`).
  - Perform server-side route gating in `(app)/layout.tsx` to redirect incomplete members to `/onboarding`.
  - Save progress incrementally so browser refresh restores exact step state.
