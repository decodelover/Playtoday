# PlayToday Onboarding Architecture

## Overview

PlayToday Onboarding provides a multi-step preference setup and responsible-play commitment for newly authenticated members. It bridges Supabase authentication (Phase 2G) and the sports intelligence application dashboard (Phase 3).

---

## Route Architecture & Gating

- **Canonical Route**: `/onboarding`
- **Guest Access**: Unauthenticated visitors attempting to open `/onboarding` are redirected to `/sign-in`.
- **Incomplete User Gate**: Authenticated users with `onboarding_completed_at IS NULL` attempting to open any dashboard route under `(app)` are automatically redirected to `/onboarding`.
- **Completed User Gate**: Authenticated users who have completed onboarding (`onboarding_completed_at IS NOT NULL`) visiting `/onboarding` are redirected to `/overview`.

---

## Step Flow & Data Collection

| Step       | Title                  | Purpose                                                                                                                         |
| :--------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **Step 1** | Welcome                | Introduction to PlayToday sports analytics workspace.                                                                           |
| **Step 2** | Sports Selection       | Football (Primary active engine), Basketball & Tennis (Upcoming).                                                               |
| **Step 3** | Bookmaker Preference   | Preferred target platform (SportyBet, Bet9ja, MSport) for formatting compatibility.                                             |
| **Step 4** | Target Markets         | Selected analysis markets (1X2, Double Chance, Draw No Bet, Over/Under, BTTS, Team Goals, Asian Handicap).                      |
| **Step 5** | Target Odds & Strategy | Default odds target (numeric range 1.05 - 1000.00), analysis strategy (Conservative / Balanced / Aggressive), and risk profile. |
| **Step 6** | Notifications          | Email and in-app alert channel preferences.                                                                                     |
| **Step 7** | Responsible Play       | Required acknowledgement of probabilistic analytics, odds risk context, and responsible play commitment.                        |
| **Step 8** | Review & Confirm       | Summary review of preferences before persisting and redirecting to `/overview`.                                                 |

---

## State Persistence & Resuming

1. Step progress is saved incrementally via `saveOnboardingStepAction` to `public.profiles.onboarding_step`.
2. Partial and final preferences are saved to `public.user_preferences`.
3. If a user refreshes or leaves mid-onboarding, opening `/onboarding` resumes from their saved `onboarding_step` with preserved choices.
4. On final submission, `completeUserOnboarding()` updates `public.user_preferences` and sets `public.profiles.onboarding_completed_at` atomically.
