-- Batch transport for already-normalized observations. The single-observation
-- function remains the canonical atomic current/history write path.
create or replace function public.ingest_odds_batch(p_observations jsonb)
returns table(
  created_count integer,
  updated_count integer,
  unchanged_count integer,
  ignored_older_count integer,
  snapshot_count integer
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  item jsonb;
  observation_action text;
  observation_snapshot boolean;
  batch_size integer;
begin
  if jsonb_typeof(p_observations) is distinct from 'array' then
    raise exception 'odds batch must be a JSON array';
  end if;

  batch_size := jsonb_array_length(p_observations);
  if batch_size = 0 or batch_size > 10000 then
    raise exception 'odds batch size must be between 1 and 10000';
  end if;

  created_count := 0;
  updated_count := 0;
  unchanged_count := 0;
  ignored_older_count := 0;
  snapshot_count := 0;

  for item in select value from jsonb_array_elements(p_observations)
  loop
    select result.action, result.snapshot_created
    into observation_action, observation_snapshot
    from public.ingest_odds_observation(
      (item->>'fixture_id')::uuid,
      (item->>'bookmaker_id')::uuid,
      (item->>'market_id')::uuid,
      item->>'selection_key',
      nullif(item->>'line', '')::numeric,
      nullif(item->>'participant', ''),
      (item->>'decimal_odds')::numeric,
      item->>'provider',
      item->>'provider_event_id',
      item->>'provider_market_id',
      item->>'provider_selection_key',
      item->>'market_status',
      (item->>'source_updated_at')::timestamptz,
      (item->>'fetched_at')::timestamptz
    ) result;

    created_count := created_count + (observation_action = 'created')::integer;
    updated_count := updated_count + (observation_action = 'updated')::integer;
    unchanged_count := unchanged_count + (observation_action = 'unchanged')::integer;
    ignored_older_count := ignored_older_count
      + (observation_action = 'ignored_older')::integer;
    snapshot_count := snapshot_count + observation_snapshot::integer;
  end loop;

  return next;
end;
$$;

revoke all on function public.ingest_odds_batch(jsonb)
from public, anon, authenticated;

grant execute on function public.ingest_odds_batch(jsonb) to service_role;
