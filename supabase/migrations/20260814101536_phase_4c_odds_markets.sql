-- Phase 4C: canonical football markets, bookmakers, current odds and history.
-- All odds tables are system-written. Authenticated users receive read-only
-- access to the canonical catalog and current-price view.

create table public.bookmakers (
  id uuid primary key default gen_random_uuid(),
  canonical_key text not null unique,
  name text not null,
  active boolean not null default true,
  region_code text,
  website_domain text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookmakers_key_format check (canonical_key ~ '^[a-z0-9][a-z0-9_-]{1,63}$'),
  constraint bookmakers_name_length check (char_length(name) between 1 and 120)
);

create table public.bookmaker_capabilities (
  id uuid primary key default gen_random_uuid(),
  bookmaker_id uuid not null references public.bookmakers(id) on delete restrict,
  odds_provider text not null,
  availability_status text not null,
  pre_match_odds boolean not null default false,
  live_odds boolean not null default false,
  booking_code_api boolean not null default false,
  direct_integration boolean not null default false,
  source_reference text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookmaker_capability_unique unique (bookmaker_id, odds_provider),
  constraint bookmaker_availability_status_check check (
    availability_status in ('verified_supported', 'not_supported', 'not_verified')
  )
);

create table public.canonical_markets (
  id uuid primary key default gen_random_uuid(),
  canonical_key text not null unique,
  name text not null,
  parameter_kind text not null default 'none',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint canonical_market_key_format check (canonical_key ~ '^[a-z][a-z0-9_]{1,63}$'),
  constraint canonical_market_parameter_kind_check check (
    parameter_kind in ('none', 'line', 'participant_line')
  )
);

create table public.provider_bookmaker_mappings (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_bookmaker_id text not null,
  provider_bookmaker_name text not null,
  bookmaker_id uuid not null references public.bookmakers(id) on delete restrict,
  verified boolean not null default false,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint provider_bookmaker_mapping_unique unique (provider, provider_bookmaker_id)
);

create table public.provider_market_mappings (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_market_id text not null,
  provider_market_name text not null,
  market_scope text not null default 'pre_match',
  market_id uuid not null references public.canonical_markets(id) on delete restrict,
  participant text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint provider_market_mapping_unique unique (
    provider,
    provider_market_id,
    market_scope
  ),
  constraint provider_market_scope_check check (market_scope in ('pre_match', 'live')),
  constraint provider_market_participant_check check (
    participant is null or participant in ('home', 'away')
  )
);

create table public.provider_selection_mappings (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_market_id text not null,
  provider_selection_key text not null,
  canonical_selection_key text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint provider_selection_mapping_unique unique (
    provider,
    provider_market_id,
    provider_selection_key
  ),
  constraint provider_selection_key_length check (
    char_length(provider_selection_key) between 1 and 120
  ),
  constraint canonical_selection_key_format check (
    canonical_selection_key ~ '^[a-z][a-z0-9_]{0,63}$'
  )
);

create table public.unresolved_odds_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  reason text not null,
  occurrence_count integer not null default 1,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  resolved_at timestamptz,
  canonical_fixture_id uuid references public.fixtures(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unresolved_odds_event_unique unique (provider, provider_event_id),
  constraint unresolved_odds_event_count_check check (occurrence_count > 0),
  constraint unresolved_odds_event_reason_check check (
    reason in ('missing_fixture_mapping', 'ambiguous_fixture_mapping', 'invalid_event')
  )
);

create table public.current_odds (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid not null references public.fixtures(id) on delete restrict,
  bookmaker_id uuid not null references public.bookmakers(id) on delete restrict,
  market_id uuid not null references public.canonical_markets(id) on delete restrict,
  selection_key text not null,
  line numeric(8, 3),
  participant text,
  decimal_odds numeric(12, 4) not null,
  provider text not null,
  provider_event_id text not null,
  provider_market_id text not null,
  provider_selection_key text not null,
  market_status text not null default 'active',
  source_updated_at timestamptz not null,
  fetched_at timestamptz not null,
  first_observed_at timestamptz not null,
  last_observed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint current_odds_selection_key_format check (
    selection_key ~ '^[a-z][a-z0-9_]{0,63}$'
  ),
  constraint current_odds_line_check check (line is null or line between -100 and 100),
  constraint current_odds_participant_check check (
    participant is null or participant in ('home', 'away')
  ),
  constraint current_odds_decimal_check check (decimal_odds > 1 and decimal_odds <= 1000),
  constraint current_odds_market_status_check check (
    market_status in ('active', 'suspended', 'closed', 'unavailable')
  )
);

create unique index current_odds_identity_unique
  on public.current_odds (
    fixture_id,
    bookmaker_id,
    market_id,
    selection_key,
    coalesce(line, -999::numeric),
    coalesce(participant, '')
  );

create index current_odds_fixture_lookup
  on public.current_odds (fixture_id, market_status, source_updated_at desc);

create index current_odds_bookmaker_market_lookup
  on public.current_odds (bookmaker_id, market_id, fixture_id);

create table public.odds_snapshots (
  id uuid primary key default gen_random_uuid(),
  current_odds_id uuid not null references public.current_odds(id) on delete restrict,
  fixture_id uuid not null references public.fixtures(id) on delete restrict,
  bookmaker_id uuid not null references public.bookmakers(id) on delete restrict,
  market_id uuid not null references public.canonical_markets(id) on delete restrict,
  selection_key text not null,
  line numeric(8, 3),
  participant text,
  decimal_odds numeric(12, 4) not null,
  provider text not null,
  provider_event_id text not null,
  provider_market_id text not null,
  provider_selection_key text not null,
  market_status text not null,
  source_updated_at timestamptz not null,
  fetched_at timestamptz not null,
  observation_hash text not null,
  created_at timestamptz not null default now(),
  constraint odds_snapshot_dedupe unique (current_odds_id, observation_hash),
  constraint odds_snapshot_decimal_check check (decimal_odds > 1 and decimal_odds <= 1000),
  constraint odds_snapshot_market_status_check check (
    market_status in ('active', 'suspended', 'closed', 'unavailable')
  )
);

create index odds_snapshots_history_lookup
  on public.odds_snapshots (current_odds_id, source_updated_at desc, created_at desc);

create index odds_snapshots_fixture_lookup
  on public.odds_snapshots (fixture_id, bookmaker_id, market_id, source_updated_at desc);

create table public.odds_ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  job_type text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'running',
  requests_used integer not null default 0,
  fixtures_requested integer not null default 0,
  events_received integer not null default 0,
  bookmakers_received integer not null default 0,
  markets_processed integer not null default 0,
  selections_processed integer not null default 0,
  snapshots_created integer not null default 0,
  current_prices_created integer not null default 0,
  current_prices_updated integer not null default 0,
  unchanged_prices integer not null default 0,
  unresolved_events integer not null default 0,
  unmapped_bookmakers integer not null default 0,
  unmapped_markets integer not null default 0,
  invalid_prices integer not null default 0,
  failures integer not null default 0,
  error_summary text,
  created_at timestamptz not null default now(),
  constraint odds_ingestion_status_check check (
    status in ('running', 'completed', 'failed')
  ),
  constraint odds_ingestion_counts_check check (
    requests_used >= 0 and fixtures_requested >= 0 and events_received >= 0
    and bookmakers_received >= 0 and markets_processed >= 0
    and selections_processed >= 0 and snapshots_created >= 0
    and current_prices_created >= 0 and current_prices_updated >= 0
    and unchanged_prices >= 0 and unresolved_events >= 0
    and unmapped_bookmakers >= 0 and unmapped_markets >= 0
    and invalid_prices >= 0 and failures >= 0
  )
);

create table public.odds_provider_health (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique,
  status text not null default 'unknown',
  last_successful_sync_at timestamptz,
  last_failure_at timestamptz,
  consecutive_failures integer not null default 0,
  requests_remaining integer,
  stale_odds_count integer not null default 0,
  unmapped_bookmaker_count integer not null default 0,
  unmapped_market_count integer not null default 0,
  unresolved_event_count integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint odds_provider_health_status_check check (
    status in ('unknown', 'healthy', 'degraded', 'unavailable')
  ),
  constraint odds_provider_health_counts_check check (
    consecutive_failures >= 0 and stale_odds_count >= 0
    and unmapped_bookmaker_count >= 0 and unmapped_market_count >= 0
    and unresolved_event_count >= 0
    and (requests_remaining is null or requests_remaining >= 0)
  )
);

create trigger set_bookmakers_updated_at
  before update on public.bookmakers
  for each row execute function private.set_updated_at();

create trigger set_bookmaker_capabilities_updated_at
  before update on public.bookmaker_capabilities
  for each row execute function private.set_updated_at();

create trigger set_canonical_markets_updated_at
  before update on public.canonical_markets
  for each row execute function private.set_updated_at();

create trigger set_provider_bookmaker_mappings_updated_at
  before update on public.provider_bookmaker_mappings
  for each row execute function private.set_updated_at();

create trigger set_provider_market_mappings_updated_at
  before update on public.provider_market_mappings
  for each row execute function private.set_updated_at();

create trigger set_provider_selection_mappings_updated_at
  before update on public.provider_selection_mappings
  for each row execute function private.set_updated_at();

create trigger set_unresolved_odds_events_updated_at
  before update on public.unresolved_odds_events
  for each row execute function private.set_updated_at();

create trigger set_current_odds_updated_at
  before update on public.current_odds
  for each row execute function private.set_updated_at();

create trigger set_odds_provider_health_updated_at
  before update on public.odds_provider_health
  for each row execute function private.set_updated_at();

create or replace function public.ingest_odds_observation(
  p_fixture_id uuid,
  p_bookmaker_id uuid,
  p_market_id uuid,
  p_selection_key text,
  p_line numeric,
  p_participant text,
  p_decimal_odds numeric,
  p_provider text,
  p_provider_event_id text,
  p_provider_market_id text,
  p_provider_selection_key text,
  p_market_status text,
  p_source_updated_at timestamptz,
  p_fetched_at timestamptz
)
returns table(action text, current_odds_id uuid, snapshot_created boolean)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  existing public.current_odds%rowtype;
  current_id uuid;
  hash_value text;
  changed boolean;
  snapshot_rows integer;
begin
  if p_decimal_odds <= 1 or p_decimal_odds > 1000 then
    raise exception 'invalid decimal odds';
  end if;

  if p_market_status not in ('active', 'suspended', 'closed', 'unavailable') then
    raise exception 'invalid market status';
  end if;

  select * into existing
  from public.current_odds current_row
  where current_row.fixture_id = p_fixture_id
    and current_row.bookmaker_id = p_bookmaker_id
    and current_row.market_id = p_market_id
    and current_row.selection_key = p_selection_key
    and current_row.line is not distinct from p_line
    and current_row.participant is not distinct from p_participant
  for update;

  if found and p_source_updated_at < existing.source_updated_at then
    return query select 'ignored_older'::text, existing.id, false;
    return;
  end if;

  if not found then
    insert into public.current_odds (
      fixture_id,
      bookmaker_id,
      market_id,
      selection_key,
      line,
      participant,
      decimal_odds,
      provider,
      provider_event_id,
      provider_market_id,
      provider_selection_key,
      market_status,
      source_updated_at,
      fetched_at,
      first_observed_at,
      last_observed_at
    ) values (
      p_fixture_id,
      p_bookmaker_id,
      p_market_id,
      p_selection_key,
      p_line,
      p_participant,
      p_decimal_odds,
      p_provider,
      p_provider_event_id,
      p_provider_market_id,
      p_provider_selection_key,
      p_market_status,
      p_source_updated_at,
      p_fetched_at,
      p_fetched_at,
      p_fetched_at
    ) returning id into current_id;

    changed := true;
  else
    current_id := existing.id;
    changed := existing.decimal_odds is distinct from p_decimal_odds
      or existing.market_status is distinct from p_market_status
      or existing.provider_selection_key is distinct from p_provider_selection_key;

    update public.current_odds
    set decimal_odds = case when changed then p_decimal_odds else decimal_odds end,
        provider = p_provider,
        provider_event_id = p_provider_event_id,
        provider_market_id = p_provider_market_id,
        provider_selection_key = p_provider_selection_key,
        market_status = case when changed then p_market_status else market_status end,
        source_updated_at = greatest(source_updated_at, p_source_updated_at),
        fetched_at = greatest(fetched_at, p_fetched_at),
        last_observed_at = greatest(last_observed_at, p_fetched_at)
    where id = current_id;
  end if;

  if not changed then
    return query select 'unchanged'::text, current_id, false;
    return;
  end if;

  hash_value := md5(concat_ws(
    '|',
    p_decimal_odds::text,
    p_market_status,
    p_source_updated_at::text,
    p_provider_selection_key
  ));

  insert into public.odds_snapshots (
    current_odds_id,
    fixture_id,
    bookmaker_id,
    market_id,
    selection_key,
    line,
    participant,
    decimal_odds,
    provider,
    provider_event_id,
    provider_market_id,
    provider_selection_key,
    market_status,
    source_updated_at,
    fetched_at,
    observation_hash
  ) values (
    current_id,
    p_fixture_id,
    p_bookmaker_id,
    p_market_id,
    p_selection_key,
    p_line,
    p_participant,
    p_decimal_odds,
    p_provider,
    p_provider_event_id,
    p_provider_market_id,
    p_provider_selection_key,
    p_market_status,
    p_source_updated_at,
    p_fetched_at,
    hash_value
  ) on conflict on constraint odds_snapshot_dedupe do nothing;

  get diagnostics snapshot_rows = row_count;

  return query select
    case when existing.id is null then 'created'::text else 'updated'::text end,
    current_id,
    snapshot_rows = 1;
end;
$$;

revoke all on function public.ingest_odds_observation(
  uuid, uuid, uuid, text, numeric, text, numeric, text, text, text, text, text,
  timestamptz, timestamptz
) from public, anon, authenticated;

grant execute on function public.ingest_odds_observation(
  uuid, uuid, uuid, text, numeric, text, numeric, text, text, text, text, text,
  timestamptz, timestamptz
) to service_role;

create view public.v_current_odds
with (security_invoker = true)
as
select
  current_price.id,
  current_price.fixture_id,
  fixture.kickoff_at,
  fixture.status as fixture_status,
  competition.id as competition_id,
  competition.name as competition_name,
  home_team.id as home_team_id,
  home_team.canonical_name as home_team_name,
  away_team.id as away_team_id,
  away_team.canonical_name as away_team_name,
  bookmaker.id as bookmaker_id,
  bookmaker.canonical_key as bookmaker_key,
  bookmaker.name as bookmaker_name,
  market.id as market_id,
  market.canonical_key as market_key,
  market.name as market_name,
  current_price.selection_key,
  current_price.line,
  current_price.participant,
  current_price.decimal_odds,
  current_price.market_status,
  current_price.source_updated_at,
  current_price.fetched_at,
  current_price.first_observed_at,
  current_price.last_observed_at,
  current_price.provider
from public.current_odds current_price
join public.fixtures fixture on fixture.id = current_price.fixture_id
join public.competitions competition on competition.id = fixture.competition_id
join public.teams home_team on home_team.id = fixture.home_team_id
join public.teams away_team on away_team.id = fixture.away_team_id
join public.bookmakers bookmaker on bookmaker.id = current_price.bookmaker_id
join public.canonical_markets market on market.id = current_price.market_id;

alter table public.bookmakers enable row level security;
alter table public.bookmaker_capabilities enable row level security;
alter table public.canonical_markets enable row level security;
alter table public.provider_bookmaker_mappings enable row level security;
alter table public.provider_market_mappings enable row level security;
alter table public.provider_selection_mappings enable row level security;
alter table public.unresolved_odds_events enable row level security;
alter table public.current_odds enable row level security;
alter table public.odds_snapshots enable row level security;
alter table public.odds_ingestion_runs enable row level security;
alter table public.odds_provider_health enable row level security;

create policy "Authenticated read bookmakers"
  on public.bookmakers for select to authenticated using (true);

create policy "Authenticated read bookmaker capabilities"
  on public.bookmaker_capabilities for select to authenticated using (true);

create policy "Authenticated read canonical markets"
  on public.canonical_markets for select to authenticated using (true);

create policy "Authenticated read current odds"
  on public.current_odds for select to authenticated using (true);

revoke all on table
  public.bookmakers,
  public.bookmaker_capabilities,
  public.canonical_markets,
  public.provider_bookmaker_mappings,
  public.provider_market_mappings,
  public.provider_selection_mappings,
  public.unresolved_odds_events,
  public.current_odds,
  public.odds_snapshots,
  public.odds_ingestion_runs,
  public.odds_provider_health,
  public.v_current_odds
from public, anon, authenticated;

grant select on table
  public.bookmakers,
  public.bookmaker_capabilities,
  public.canonical_markets,
  public.current_odds,
  public.v_current_odds
to authenticated;

grant select, insert, update, delete on table
  public.bookmakers,
  public.bookmaker_capabilities,
  public.canonical_markets,
  public.provider_bookmaker_mappings,
  public.provider_market_mappings,
  public.provider_selection_mappings,
  public.unresolved_odds_events,
  public.current_odds,
  public.odds_snapshots,
  public.odds_ingestion_runs,
  public.odds_provider_health
to service_role;

grant select on table public.v_current_odds to service_role;

insert into public.bookmakers (canonical_key, name) values
  ('sportybet', 'SportyBet'),
  ('bet9ja', 'Bet9ja'),
  ('msport', 'MSport'),
  ('10bet', '10Bet'),
  ('william-hill', 'William Hill'),
  ('bet365', 'Bet365'),
  ('marathonbet', 'Marathonbet'),
  ('unibet', 'Unibet'),
  ('betfair', 'Betfair'),
  ('betvictor', 'BetVictor'),
  ('pinnacle', 'Pinnacle'),
  ('sbo', 'SBO'),
  ('1xbet', '1xBet'),
  ('betano', 'Betano'),
  ('superbet', 'Superbet'),
  ('888sport', '888Sport'),
  ('dafabet', 'Dafabet')
on conflict (canonical_key) do update set name = excluded.name;

insert into public.bookmaker_capabilities (
  bookmaker_id,
  odds_provider,
  availability_status,
  pre_match_odds,
  live_odds,
  booking_code_api,
  direct_integration,
  source_reference,
  verified_at
)
select
  bookmaker.id,
  'api-football',
  case when bookmaker.canonical_key in ('sportybet', 'bet9ja', 'msport')
    then 'not_supported'
    else 'verified_supported'
  end,
  bookmaker.canonical_key not in ('sportybet', 'bet9ja', 'msport'),
  false,
  false,
  false,
  'API-Football /odds/bookmakers catalog verified 2026-08-14',
  now()
from public.bookmakers bookmaker
on conflict (bookmaker_id, odds_provider) do update set
  availability_status = excluded.availability_status,
  pre_match_odds = excluded.pre_match_odds,
  live_odds = excluded.live_odds,
  booking_code_api = false,
  direct_integration = false,
  source_reference = excluded.source_reference,
  verified_at = excluded.verified_at;

insert into public.provider_bookmaker_mappings (
  provider,
  provider_bookmaker_id,
  provider_bookmaker_name,
  bookmaker_id,
  verified
)
select 'api-football', mapping.provider_id, mapping.provider_name, bookmaker.id, true
from (values
  ('1', '10Bet', '10bet'),
  ('2', 'Marathonbet', 'marathonbet'),
  ('3', 'Betfair', 'betfair'),
  ('4', 'Pinnacle', 'pinnacle'),
  ('5', 'SBO', 'sbo'),
  ('7', 'William Hill', 'william-hill'),
  ('8', 'Bet365', 'bet365'),
  ('9', 'Dafabet', 'dafabet'),
  ('11', '1xBet', '1xbet'),
  ('16', 'Unibet', 'unibet'),
  ('21', '888Sport', '888sport'),
  ('32', 'Betano', 'betano'),
  ('34', 'Superbet', 'superbet'),
  ('36', 'BetVictor', 'betvictor')
) as mapping(provider_id, provider_name, canonical_key)
join public.bookmakers bookmaker on bookmaker.canonical_key = mapping.canonical_key
on conflict (provider, provider_bookmaker_id) do update set
  provider_bookmaker_name = excluded.provider_bookmaker_name,
  bookmaker_id = excluded.bookmaker_id,
  verified = true,
  last_seen_at = now();

insert into public.canonical_markets (canonical_key, name, parameter_kind) values
  ('match_result', 'Match Result', 'none'),
  ('double_chance', 'Double Chance', 'none'),
  ('draw_no_bet', 'Draw No Bet', 'none'),
  ('both_teams_to_score', 'Both Teams to Score', 'none'),
  ('total_goals', 'Total Goals', 'line'),
  ('team_total_goals', 'Team Total Goals', 'participant_line'),
  ('asian_handicap', 'Asian Handicap', 'participant_line')
on conflict (canonical_key) do update set
  name = excluded.name,
  parameter_kind = excluded.parameter_kind,
  active = true;

insert into public.provider_market_mappings (
  provider,
  provider_market_id,
  provider_market_name,
  market_scope,
  market_id,
  participant,
  verified
)
select 'api-football', mapping.provider_id, mapping.provider_name, 'pre_match',
       market.id, mapping.participant, true
from (values
  ('1', 'Match Winner', 'match_result', null::text),
  ('4', 'Asian Handicap', 'asian_handicap', null::text),
  ('5', 'Goals Over/Under', 'total_goals', null::text),
  ('8', 'Both Teams Score', 'both_teams_to_score', null::text),
  ('12', 'Double Chance', 'double_chance', null::text),
  ('16', 'Total - Home', 'team_total_goals', 'home'::text),
  ('17', 'Total - Away', 'team_total_goals', 'away'::text)
) as mapping(provider_id, provider_name, canonical_key, participant)
join public.canonical_markets market on market.canonical_key = mapping.canonical_key
on conflict (provider, provider_market_id, market_scope) do update set
  provider_market_name = excluded.provider_market_name,
  market_id = excluded.market_id,
  participant = excluded.participant,
  verified = true;

insert into public.provider_selection_mappings (
  provider,
  provider_market_id,
  provider_selection_key,
  canonical_selection_key,
  verified
) values
  ('api-football', '1', 'Home', 'home', true),
  ('api-football', '1', 'Draw', 'draw', true),
  ('api-football', '1', 'Away', 'away', true),
  ('api-football', '8', 'Yes', 'yes', true),
  ('api-football', '8', 'No', 'no', true),
  ('api-football', '12', 'Home/Draw', 'home_or_draw', true),
  ('api-football', '12', 'Home/Away', 'home_or_away', true),
  ('api-football', '12', 'Draw/Away', 'draw_or_away', true)
on conflict (provider, provider_market_id, provider_selection_key) do update set
  canonical_selection_key = excluded.canonical_selection_key,
  verified = true;

insert into public.odds_provider_health (provider, status)
values ('api-football', 'unknown')
on conflict (provider) do nothing;
