-- Make the internal-only RLS posture explicit to clients and cover every
-- Phase 4C foreign key used by maintenance or deletion checks.
create policy "Clients denied provider bookmaker mappings"
  on public.provider_bookmaker_mappings
  for all to anon, authenticated using (false) with check (false);

create policy "Clients denied provider market mappings"
  on public.provider_market_mappings
  for all to anon, authenticated using (false) with check (false);

create policy "Clients denied provider selection mappings"
  on public.provider_selection_mappings
  for all to anon, authenticated using (false) with check (false);

create policy "Clients denied unresolved odds events"
  on public.unresolved_odds_events
  for all to anon, authenticated using (false) with check (false);

create policy "Clients denied odds history"
  on public.odds_snapshots
  for all to anon, authenticated using (false) with check (false);

create policy "Clients denied odds ingestion runs"
  on public.odds_ingestion_runs
  for all to anon, authenticated using (false) with check (false);

create policy "Clients denied odds provider health"
  on public.odds_provider_health
  for all to anon, authenticated using (false) with check (false);

create index current_odds_market_fk_idx
  on public.current_odds (market_id);

create index odds_snapshots_bookmaker_fk_idx
  on public.odds_snapshots (bookmaker_id);

create index odds_snapshots_market_fk_idx
  on public.odds_snapshots (market_id);

create index provider_bookmaker_mappings_bookmaker_fk_idx
  on public.provider_bookmaker_mappings (bookmaker_id);

create index provider_market_mappings_market_fk_idx
  on public.provider_market_mappings (market_id);

create index unresolved_odds_events_fixture_fk_idx
  on public.unresolved_odds_events (canonical_fixture_id)
  where canonical_fixture_id is not null;
