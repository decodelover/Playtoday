-- Cover sports foreign keys used by joins and referential checks.
create index idx_competitions_sport on public.competitions (sport_id);
create index idx_competitions_area on public.competitions (area_id);
create index idx_teams_sport on public.teams (sport_id);
create index idx_teams_area on public.teams (area_id);
create index idx_fixtures_season on public.fixtures (season_id);
create index idx_fixtures_sport on public.fixtures (sport_id);
create index idx_fixtures_venue on public.fixtures (venue_id);
