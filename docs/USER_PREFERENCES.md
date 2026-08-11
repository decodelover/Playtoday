# PlayToday User Preferences & Canonical Schema

## Database Mapping

Preferences are persisted in `public.user_preferences` table with RLS enforcing `auth.uid() = user_id`.

```sql
create table public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_sports text[] not null default array['football'],
  preferred_bookmakers text[] not null default array['sportybet'],
  preferred_markets text[] not null default array['1x2', 'double_chance', 'over_under'],
  target_odds numeric(6, 2) not null default 3.00,
  default_strategy text not null default 'balanced',
  risk_preference text not null default 'moderate',
  notification_channels jsonb not null default '{"email": true, "in_app": true}'::jsonb,
  responsible_play_ack boolean not null default false,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## Canonical Identifiers

- **Sports**: `football` is the only persisted supported value. Basketball and tennis are non-operational UI notices and cannot be stored.
- **Bookmakers**: `sportybet`, `bet9ja`, `msport`
- **Markets**: `1x2`, `double_chance`, `dnb`, `over_under`, `btts`, `team_goals`, `handicap`
- **Strategies**: `conservative`, `balanced`, `aggressive`
- **Risk Profiles**: `conservative`, `moderate`, `higher_risk`

---

## Credentials Safety Policy

PlayToday strictly NEVER requests, stores, or processes betting account credentials, passwords, PINs, or API keys. Bookmaker selections are solely used for formatting market codes and coupon structures.

## Validation and ownership

- The user ID is the primary key, foreign key, and ownership key.
- RLS requires `auth.uid() = user_id` for self-service reads and writes.
- Bookmaker and market arrays reject unsupported or duplicate identifiers.
- Target odds must be between `1.05` and `1000.00`.
- Notification JSON contains exactly boolean `email` and `in_app` keys.
- Timezones use recognized IANA identifiers.
- Completion requires `responsible_play_ack = true`; drafts default to false.

Settings must reuse these identifiers and the same table. It must not create onboarding-only variants.

## Settings integration

`/settings/preferences`, `/settings/notifications`, and `/settings/profile` read the existing preference row. Settings imports the same validation constants used by onboarding and updates only the intended columns. Ownership is derived from the authenticated server session, then enforced again by RLS. Explicit save actions revalidate the affected route so refresh reads the persisted values.

The notification model currently supports only `email` and `in_app`. Push and event-category controls are not exposed because no corresponding delivery system or persisted category model exists. The responsible-play acknowledgement is displayed but cannot be turned off after completed onboarding; cooling-off and self-exclusion remain absent without enforced account states.
