-- PlayToday Phase 4A: Canonical Sports Data & Ingestion Foundation Schema

-- 1. Canonical Fixture Status Enum
CREATE TYPE public.fixture_status AS ENUM (
  'scheduled',
  'delayed',
  'postponed',
  'cancelled',
  'suspended',
  'live',
  'halftime',
  'extra_time',
  'penalties',
  'finished',
  'abandoned',
  'awarded',
  'unknown'
);

-- 2. Sports Table
CREATE TABLE public.sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed production sport: Football
INSERT INTO public.sports (key, name, active)
VALUES ('football', 'Football', true)
ON CONFLICT (key) DO NOTHING;

-- 3. Geographical Areas / Countries Table
CREATE TABLE public.areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  flag_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Competitions Table
CREATE TABLE public.competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id UUID NOT NULL REFERENCES public.sports(id) ON DELETE RESTRICT,
  area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
  canonical_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT,
  type TEXT NOT NULL DEFAULT 'league',
  logo_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Seasons Table
CREATE TABLE public.seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Teams Table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id UUID NOT NULL REFERENCES public.sports(id) ON DELETE RESTRICT,
  area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
  canonical_name TEXT NOT NULL,
  short_name TEXT,
  code TEXT,
  logo_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Venues Table
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  capacity INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Fixtures Table
CREATE TABLE public.fixtures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id UUID NOT NULL REFERENCES public.sports(id) ON DELETE RESTRICT,
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE RESTRICT,
  season_id UUID REFERENCES public.seasons(id) ON DELETE SET NULL,
  home_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE RESTRICT,
  away_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE RESTRICT,
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  kickoff_at TIMESTAMPTZ NOT NULL,
  status public.fixture_status NOT NULL DEFAULT 'scheduled',
  status_detail TEXT,
  matchday INTEGER,
  round TEXT,
  stage TEXT,
  home_score INTEGER,
  away_score INTEGER,
  halftime_home_score INTEGER,
  halftime_away_score INTEGER,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  source_updated_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fixtures_different_teams CHECK (home_team_id <> away_team_id)
);

CREATE INDEX idx_fixtures_kickoff ON public.fixtures (kickoff_at);
CREATE INDEX idx_fixtures_status ON public.fixtures (status);
CREATE INDEX idx_fixtures_competition ON public.fixtures (competition_id);
CREATE INDEX idx_fixtures_home_team ON public.fixtures (home_team_id);
CREATE INDEX idx_fixtures_away_team ON public.fixtures (away_team_id);

-- 9. Provider Entity Mappings Table
CREATE TABLE public.provider_entity_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  provider_entity_id TEXT NOT NULL,
  canonical_entity_id UUID NOT NULL,
  source_last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT provider_entity_unique UNIQUE (provider, entity_type, provider_entity_id)
);

CREATE INDEX idx_provider_mappings_lookup 
  ON public.provider_entity_mappings (provider, entity_type, provider_entity_id);

-- 10. Provider Raw Payloads Audit Table
CREATE TABLE public.provider_payloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Ingestion Runs Table
CREATE TABLE public.sports_ingestion_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  job_type TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running',
  fetched_count INTEGER NOT NULL DEFAULT 0,
  created_count INTEGER NOT NULL DEFAULT 0,
  updated_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  error_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Provider Health Table
CREATE TABLE public.sports_provider_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT UNIQUE NOT NULL,
  last_successful_sync_at TIMESTAMPTZ,
  last_failure_at TIMESTAMPTZ,
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  status TEXT NOT NULL DEFAULT 'healthy',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Public Fixture Read View
CREATE OR REPLACE VIEW public.v_public_fixtures AS
SELECT
  f.id,
  f.kickoff_at,
  f.status,
  f.status_detail,
  f.home_score,
  f.away_score,
  f.halftime_home_score,
  f.halftime_away_score,
  f.matchday,
  f.round,
  f.stage,
  f.last_synced_at,
  c.id AS competition_id,
  c.name AS competition_name,
  c.canonical_key AS competition_key,
  c.logo_url AS competition_logo_url,
  ht.id AS home_team_id,
  ht.canonical_name AS home_team_name,
  ht.short_name AS home_team_short_name,
  ht.logo_url AS home_team_logo_url,
  at.id AS away_team_id,
  at.canonical_name AS away_team_name,
  at.short_name AS away_team_short_name,
  at.logo_url AS away_team_logo_url,
  v.name AS venue_name,
  v.city AS venue_city
FROM public.fixtures f
JOIN public.competitions c ON f.competition_id = c.id
JOIN public.teams ht ON f.home_team_id = ht.id
JOIN public.teams at ON f.away_team_id = at.id
LEFT JOIN public.venues v ON f.venue_id = v.id;

-- 14. Row Level Security & Access Control
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_entity_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_payloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_ingestion_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_provider_health ENABLE ROW LEVEL SECURITY;

-- Public & Authenticated Read-Only Policies for Domain Entities
CREATE POLICY "Public read sports" ON public.sports FOR SELECT USING (true);
CREATE POLICY "Public read areas" ON public.areas FOR SELECT USING (true);
CREATE POLICY "Public read competitions" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Public read seasons" ON public.seasons FOR SELECT USING (true);
CREATE POLICY "Public read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public read venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Public read fixtures" ON public.fixtures FOR SELECT USING (true);

-- Internal Administrative & Ingestion-Only Tables (No Public Access)
CREATE POLICY "Service role provider_entity_mappings" ON public.provider_entity_mappings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role provider_payloads" ON public.provider_payloads
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role sports_ingestion_runs" ON public.sports_ingestion_runs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role sports_provider_health" ON public.sports_provider_health
  FOR ALL USING (auth.role() = 'service_role');
