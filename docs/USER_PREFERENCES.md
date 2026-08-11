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
  responsible_play_ack boolean not null default true,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## Canonical Identifiers

- **Sports**: `football`, `basketball`, `tennis`
- **Bookmakers**: `sportybet`, `bet9ja`, `msport`
- **Markets**: `1x2`, `double_chance`, `dnb`, `over_under`, `btts`, `team_goals`, `handicap`
- **Strategies**: `conservative`, `balanced`, `aggressive`
- **Risk Profiles**: `conservative`, `moderate`, `higher_risk`

---

## Credentials Safety Policy

PlayToday strictly NEVER requests, stores, or processes betting account credentials, passwords, PINs, or API keys. Bookmaker selections are solely used for formatting market codes and coupon structures.
