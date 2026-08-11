-- Phase 2H: Production User Onboarding and Preferences Migration

-- 1. Add onboarding tracking fields to profiles table
alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz,
  add column if not exists onboarding_step text default 'welcome';

comment on column public.profiles.onboarding_completed_at is 'Timestamp when the user completed first-time onboarding.';
comment on column public.profiles.onboarding_step is 'Current active onboarding step for resilient progress recovery.';

-- 2. Create user_preferences table for storing sports intelligence settings
create table if not exists public.user_preferences (
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
  updated_at timestamptz not null default now(),

  constraint check_target_odds_positive check (target_odds > 1.00 and target_odds <= 1000.00),
  constraint check_strategy_valid check (default_strategy in ('conservative', 'balanced', 'aggressive')),
  constraint check_risk_valid check (risk_preference in ('conservative', 'moderate', 'higher_risk'))
);

comment on table public.user_preferences is 'Persisted sports intelligence, odds targets, and responsible-play settings.';

-- 3. Enable and Force Row Level Security (RLS)
alter table public.user_preferences enable row level security;
alter table public.user_preferences force row level security;

-- 4. RLS Security Policies
create policy "Users can read own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. Automatically create empty preferences on new user signup
create or replace function public.handle_new_user_preferences()
returns trigger as $$
begin
  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created_preferences
  after insert on auth.users
  for each row execute function public.handle_new_user_preferences();
