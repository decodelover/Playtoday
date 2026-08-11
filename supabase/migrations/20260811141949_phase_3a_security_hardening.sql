-- Phase 3A: Core data architecture and account security hardening.
--
-- This migration is additive and preserves existing user records. It removes
-- direct access to server-controlled onboarding fields, moves Auth trigger
-- code out of the exposed public schema, and makes onboarding completion one
-- transaction.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Remove the two public Auth triggers before replacing the canonical profile
-- creation path. Preferences are created only after a user saves onboarding
-- progress, so signup does not fabricate a responsible-play acknowledgement.
drop trigger if exists on_auth_user_created_preferences on auth.users;
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_created_setup on auth.users;
drop function if exists public.handle_new_user_preferences();
drop function if exists public.handle_new_user();
drop function if exists public.handle_new_user_setup();

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate_display_name text;
begin
  candidate_display_name := nullif(
    btrim(
      left(
        coalesce(
          new.raw_user_meta_data ->> 'display_name',
          new.raw_user_meta_data ->> 'full_name',
          split_part(coalesce(new.email, ''), '@', 1)
        ),
        100
      )
    ),
    ''
  );

  if candidate_display_name is not null and char_length(candidate_display_name) < 2 then
    candidate_display_name := null;
  end if;

  insert into public.profiles (id, display_name)
  values (new.id, candidate_display_name)
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function private.handle_new_auth_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_auth_user();

-- Normalize only contradictory onboarding state before adding constraints.
update public.profiles
set onboarding_step = case
  when onboarding_completed_at is not null then 'completed'
  when onboarding_step is null or onboarding_step = 'completed' then 'welcome'
  else onboarding_step
end
where onboarding_step is null
   or onboarding_step = 'completed'
   or onboarding_completed_at is not null;

alter table public.profiles
  alter column onboarding_step set default 'welcome',
  alter column onboarding_step set not null,
  add constraint profiles_onboarding_step_check
    check (
      onboarding_step in (
        'welcome',
        'sports',
        'bookmakers',
        'markets',
        'target_odds',
        'notifications',
        'responsible_play',
        'review',
        'completed'
      )
    ),
  add constraint profiles_onboarding_completion_check
    check (
      (onboarding_completed_at is null and onboarding_step <> 'completed')
      or
      (onboarding_completed_at is not null and onboarding_step = 'completed')
    ),
  add constraint profiles_avatar_url_length_check
    check (avatar_url is null or char_length(avatar_url) <= 2048);

-- A pre-onboarding default must never claim that the member acknowledged the
-- responsible-play statement. Preserve acknowledgements for completed users.
update public.user_preferences as preferences
set responsible_play_ack = false
from public.profiles as profiles
where profiles.id = preferences.user_id
  and profiles.onboarding_completed_at is null
  and preferences.responsible_play_ack = true;

alter table public.user_preferences
  alter column responsible_play_ack set default false,
  add constraint user_preferences_sports_check
    check (preferred_sports = array['football']::text[]),
  add constraint user_preferences_bookmakers_check
    check (
      cardinality(preferred_bookmakers) between 1 and 3
      and preferred_bookmakers <@ array['sportybet', 'bet9ja', 'msport']::text[]
      and array_position(preferred_bookmakers, null) is null
      and cardinality(array_positions(preferred_bookmakers, 'sportybet')) <= 1
      and cardinality(array_positions(preferred_bookmakers, 'bet9ja')) <= 1
      and cardinality(array_positions(preferred_bookmakers, 'msport')) <= 1
    ),
  add constraint user_preferences_markets_check
    check (
      cardinality(preferred_markets) between 1 and 7
      and preferred_markets <@ array[
        '1x2',
        'double_chance',
        'dnb',
        'over_under',
        'btts',
        'team_goals',
        'handicap'
      ]::text[]
      and array_position(preferred_markets, null) is null
      and cardinality(array_positions(preferred_markets, '1x2')) <= 1
      and cardinality(array_positions(preferred_markets, 'double_chance')) <= 1
      and cardinality(array_positions(preferred_markets, 'dnb')) <= 1
      and cardinality(array_positions(preferred_markets, 'over_under')) <= 1
      and cardinality(array_positions(preferred_markets, 'btts')) <= 1
      and cardinality(array_positions(preferred_markets, 'team_goals')) <= 1
      and cardinality(array_positions(preferred_markets, 'handicap')) <= 1
    ),
  add constraint user_preferences_target_odds_check
    check (target_odds >= 1.05 and target_odds <= 1000.00),
  add constraint user_preferences_notifications_check
    check (
      jsonb_typeof(notification_channels) = 'object'
      and notification_channels ?& array['email', 'in_app']
      and notification_channels - array['email', 'in_app'] = '{}'::jsonb
      and jsonb_typeof(notification_channels -> 'email') = 'boolean'
      and jsonb_typeof(notification_channels -> 'in_app') = 'boolean'
    ),
  add constraint user_preferences_timezone_shape_check
    check (
      char_length(timezone) between 1 and 64
      and timezone = btrim(timezone)
      and timezone !~ '[[:space:]]'
    );

-- Replace the looser Phase 2H target-odds constraint with the canonical bound.
alter table public.user_preferences
  drop constraint if exists check_target_odds_positive;

create or replace function private.validate_user_preferences()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_timezone_names
    where name = new.timezone
  ) then
    raise exception using
      errcode = '23514',
      message = 'timezone is not a recognized IANA identifier';
  end if;

  return new;
end;
$$;

revoke all on function private.validate_user_preferences() from public, anon, authenticated;

create trigger validate_user_preferences_before_write
  before insert or update on public.user_preferences
  for each row execute function private.validate_user_preferences();

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := statement_timestamp();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

create trigger set_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function private.set_updated_at();

-- Recreate ownership policies with explicit roles and cached auth.uid() calls.
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

create policy "Members can read their profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Members can update their public profile fields"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can read own preferences" on public.user_preferences;
drop policy if exists "Users can insert own preferences" on public.user_preferences;
drop policy if exists "Users can update own preferences" on public.user_preferences;

create policy "Members can read their preferences"
  on public.user_preferences
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Members can insert their preferences"
  on public.user_preferences
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Members can update their preferences"
  on public.user_preferences
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Explicit grants are required for new Supabase Data API defaults. Column-level
-- profile grants keep onboarding completion and timestamps server-controlled.
revoke all on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name, avatar_url) on table public.profiles to authenticated;

revoke all on table public.user_preferences from public, anon, authenticated;
grant select on table public.user_preferences to authenticated;
grant insert (
  user_id,
  preferred_sports,
  preferred_bookmakers,
  preferred_markets,
  target_odds,
  default_strategy,
  risk_preference,
  notification_channels,
  responsible_play_ack,
  timezone
) on table public.user_preferences to authenticated;
grant update (
  preferred_sports,
  preferred_bookmakers,
  preferred_markets,
  target_odds,
  default_strategy,
  risk_preference,
  notification_channels,
  responsible_play_ack,
  timezone
) on table public.user_preferences to authenticated;

-- Persist onboarding progress and the current preferences in one transaction.
-- Ownership always comes from auth.uid(); callers cannot provide a user ID.
create or replace function public.save_onboarding_progress(
  p_step text,
  p_preferred_sports text[],
  p_preferred_bookmakers text[],
  p_preferred_markets text[],
  p_target_odds numeric,
  p_default_strategy text,
  p_risk_preference text,
  p_notification_channels jsonb,
  p_responsible_play_ack boolean,
  p_timezone text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
begin
  if caller_id is null then
    raise exception using errcode = '42501', message = 'authentication required';
  end if;

  if p_step not in (
    'welcome',
    'sports',
    'bookmakers',
    'markets',
    'target_odds',
    'notifications',
    'responsible_play',
    'review'
  ) then
    raise exception using errcode = '23514', message = 'invalid onboarding step';
  end if;

  insert into public.user_preferences (
    user_id,
    preferred_sports,
    preferred_bookmakers,
    preferred_markets,
    target_odds,
    default_strategy,
    risk_preference,
    notification_channels,
    responsible_play_ack,
    timezone
  )
  values (
    caller_id,
    p_preferred_sports,
    p_preferred_bookmakers,
    p_preferred_markets,
    p_target_odds,
    p_default_strategy,
    p_risk_preference,
    p_notification_channels,
    p_responsible_play_ack,
    p_timezone
  )
  on conflict (user_id) do update set
    preferred_sports = excluded.preferred_sports,
    preferred_bookmakers = excluded.preferred_bookmakers,
    preferred_markets = excluded.preferred_markets,
    target_odds = excluded.target_odds,
    default_strategy = excluded.default_strategy,
    risk_preference = excluded.risk_preference,
    notification_channels = excluded.notification_channels,
    responsible_play_ack = excluded.responsible_play_ack,
    timezone = excluded.timezone;

  update public.profiles
  set onboarding_step = p_step
  where id = caller_id
    and onboarding_completed_at is null;

  if not found then
    raise exception using errcode = 'P0002', message = 'incomplete profile not found';
  end if;
end;
$$;

revoke all on function public.save_onboarding_progress(
  text,
  text[],
  text[],
  text[],
  numeric,
  text,
  text,
  jsonb,
  boolean,
  text
) from public, anon;
grant execute on function public.save_onboarding_progress(
  text,
  text[],
  text[],
  text[],
  numeric,
  text,
  text,
  jsonb,
  boolean,
  text
) to authenticated;

-- Completing onboarding writes the final preferences and completion timestamp
-- in the same PostgreSQL transaction. Repeated submissions update the same row.
create or replace function public.complete_onboarding(
  p_preferred_sports text[],
  p_preferred_bookmakers text[],
  p_preferred_markets text[],
  p_target_odds numeric,
  p_default_strategy text,
  p_risk_preference text,
  p_notification_channels jsonb,
  p_responsible_play_ack boolean,
  p_timezone text
)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  completed_at timestamptz := statement_timestamp();
begin
  if caller_id is null then
    raise exception using errcode = '42501', message = 'authentication required';
  end if;

  if p_responsible_play_ack is distinct from true then
    raise exception using
      errcode = '23514',
      message = 'responsible play acknowledgement required';
  end if;

  insert into public.user_preferences (
    user_id,
    preferred_sports,
    preferred_bookmakers,
    preferred_markets,
    target_odds,
    default_strategy,
    risk_preference,
    notification_channels,
    responsible_play_ack,
    timezone
  )
  values (
    caller_id,
    p_preferred_sports,
    p_preferred_bookmakers,
    p_preferred_markets,
    p_target_odds,
    p_default_strategy,
    p_risk_preference,
    p_notification_channels,
    p_responsible_play_ack,
    p_timezone
  )
  on conflict (user_id) do update set
    preferred_sports = excluded.preferred_sports,
    preferred_bookmakers = excluded.preferred_bookmakers,
    preferred_markets = excluded.preferred_markets,
    target_odds = excluded.target_odds,
    default_strategy = excluded.default_strategy,
    risk_preference = excluded.risk_preference,
    notification_channels = excluded.notification_channels,
    responsible_play_ack = excluded.responsible_play_ack,
    timezone = excluded.timezone;

  update public.profiles
  set
    onboarding_completed_at = coalesce(onboarding_completed_at, completed_at),
    onboarding_step = 'completed'
  where id = caller_id;

  if not found then
    raise exception using errcode = 'P0002', message = 'profile not found';
  end if;

  select onboarding_completed_at
  into completed_at
  from public.profiles
  where id = caller_id;

  return completed_at;
end;
$$;

revoke all on function public.complete_onboarding(
  text[],
  text[],
  text[],
  numeric,
  text,
  text,
  jsonb,
  boolean,
  text
) from public, anon;
grant execute on function public.complete_onboarding(
  text[],
  text[],
  text[],
  numeric,
  text,
  text,
  jsonb,
  boolean,
  text
) to authenticated;

comment on function public.save_onboarding_progress(
  text,
  text[],
  text[],
  text[],
  numeric,
  text,
  text,
  jsonb,
  boolean,
  text
) is 'Atomically saves the authenticated member onboarding draft and current step.';

comment on function public.complete_onboarding(
  text[],
  text[],
  text[],
  numeric,
  text,
  text,
  jsonb,
  boolean,
  text
) is 'Atomically persists validated preferences and completes onboarding for auth.uid().';
