-- PlayToday Phase 4B: Sports Data API access and RLS hardening.

-- The authenticated dashboard reads canonical sports records. Anonymous clients
-- cannot read or mutate sports data, and authenticated clients cannot mutate it.
revoke all on table public.sports from public, anon, authenticated;
revoke all on table public.areas from public, anon, authenticated;
revoke all on table public.competitions from public, anon, authenticated;
revoke all on table public.seasons from public, anon, authenticated;
revoke all on table public.teams from public, anon, authenticated;
revoke all on table public.venues from public, anon, authenticated;
revoke all on table public.fixtures from public, anon, authenticated;
revoke all on table public.v_public_fixtures from public, anon, authenticated;

grant select on table public.sports to authenticated;
grant select on table public.areas to authenticated;
grant select on table public.competitions to authenticated;
grant select on table public.seasons to authenticated;
grant select on table public.teams to authenticated;
grant select on table public.venues to authenticated;
grant select on table public.fixtures to authenticated;
grant select on table public.v_public_fixtures to authenticated;

-- The service role is the sole Data API writer for canonical and internal data.
grant select, insert, update, delete on table public.sports to service_role;
grant select, insert, update, delete on table public.areas to service_role;
grant select, insert, update, delete on table public.competitions to service_role;
grant select, insert, update, delete on table public.seasons to service_role;
grant select, insert, update, delete on table public.teams to service_role;
grant select, insert, update, delete on table public.venues to service_role;
grant select, insert, update, delete on table public.fixtures to service_role;
grant select, insert, update, delete on table public.provider_entity_mappings to service_role;
grant select, insert, update, delete on table public.provider_payloads to service_role;
grant select, insert, update, delete on table public.sports_ingestion_runs to service_role;
grant select, insert, update, delete on table public.sports_provider_health to service_role;
grant select on table public.v_public_fixtures to service_role;

-- Internal ingestion metadata is inaccessible to browser roles.
revoke all on table public.provider_entity_mappings from public, anon, authenticated;
revoke all on table public.provider_payloads from public, anon, authenticated;
revoke all on table public.sports_ingestion_runs from public, anon, authenticated;
revoke all on table public.sports_provider_health from public, anon, authenticated;

-- Replace broad policies with explicit authenticated read policies.
drop policy if exists "Public read sports" on public.sports;
drop policy if exists "Public read areas" on public.areas;
drop policy if exists "Public read competitions" on public.competitions;
drop policy if exists "Public read seasons" on public.seasons;
drop policy if exists "Public read teams" on public.teams;
drop policy if exists "Public read venues" on public.venues;
drop policy if exists "Public read fixtures" on public.fixtures;

create policy "Members can read sports"
on public.sports for select to authenticated using (true);

create policy "Members can read areas"
on public.areas for select to authenticated using (true);

create policy "Members can read competitions"
on public.competitions for select to authenticated using (true);

create policy "Members can read seasons"
on public.seasons for select to authenticated using (true);

create policy "Members can read teams"
on public.teams for select to authenticated using (true);

create policy "Members can read venues"
on public.venues for select to authenticated using (true);

create policy "Members can read fixtures"
on public.fixtures for select to authenticated using (true);

-- Service-role keys bypass RLS. These deprecated policies are unnecessary and
-- would otherwise keep auth.role() in the production policy inventory.
drop policy if exists "Service role provider_entity_mappings"
on public.provider_entity_mappings;
drop policy if exists "Service role provider_payloads"
on public.provider_payloads;
drop policy if exists "Service role sports_ingestion_runs"
on public.sports_ingestion_runs;
drop policy if exists "Service role sports_provider_health"
on public.sports_provider_health;

-- The view must obey the caller's privileges and underlying RLS policies.
alter view public.v_public_fixtures set (security_invoker = true);

-- Season upserts use this natural key during repeated provider synchronization.
alter table public.seasons
  add constraint seasons_competition_name_unique unique (competition_id, name);
