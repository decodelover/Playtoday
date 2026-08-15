-- Forward repair for the deployed Phase 4C ingestion function.
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
