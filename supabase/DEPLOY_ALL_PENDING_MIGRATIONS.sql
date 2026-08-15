-- ==============================================================================
-- PLAYTODAY — COMPLETE CONSOLIDATED SUPABASE MIGRATION SCRIPT (PHASE 4C & 4D)
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/enkclmyrvbqdktcqjcvf/sql
-- ==============================================================================

-- ==============================================================================
-- SECTION 1: PHASE 4C — CANONICAL MARKETS, BOOKMAKERS, AND ODDS FOUNDATION
-- ==============================================================================

-- 1. Bookmakers table (if not exists)
CREATE TABLE IF NOT EXISTS public.bookmakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  region_code TEXT,
  website_domain TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Bookmaker Capabilities
CREATE TABLE IF NOT EXISTS public.bookmaker_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bookmaker_id UUID NOT NULL REFERENCES public.bookmakers(id) ON DELETE RESTRICT,
  odds_provider TEXT NOT NULL,
  availability_status TEXT NOT NULL DEFAULT 'verified_supported',
  pre_match_odds BOOLEAN NOT NULL DEFAULT false,
  live_odds BOOLEAN NOT NULL DEFAULT false,
  booking_code_api BOOLEAN NOT NULL DEFAULT false,
  direct_integration BOOLEAN NOT NULL DEFAULT false,
  source_reference TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bookmaker_capability_unique UNIQUE (bookmaker_id, odds_provider)
);

-- 3. Canonical Markets
CREATE TABLE IF NOT EXISTS public.canonical_markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  parameter_kind TEXT NOT NULL DEFAULT 'none',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Market Definitions
CREATE TABLE IF NOT EXISTS public.market_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'match_result',
  description TEXT,
  supported_selections JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Provider Mappings
CREATE TABLE IF NOT EXISTS public.provider_bookmaker_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  provider_bookmaker_id TEXT NOT NULL,
  provider_bookmaker_name TEXT NOT NULL,
  bookmaker_id UUID NOT NULL REFERENCES public.bookmakers(id) ON DELETE RESTRICT,
  verified BOOLEAN NOT NULL DEFAULT false,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT provider_bookmaker_mapping_unique UNIQUE (provider, provider_bookmaker_id)
);

CREATE TABLE IF NOT EXISTS public.provider_market_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  provider_market_id TEXT NOT NULL,
  provider_market_name TEXT NOT NULL,
  market_scope TEXT NOT NULL DEFAULT 'pre_match',
  market_id UUID NOT NULL REFERENCES public.canonical_markets(id) ON DELETE RESTRICT,
  participant TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT provider_market_mapping_unique UNIQUE (provider, provider_market_id, market_scope)
);

CREATE TABLE IF NOT EXISTS public.provider_selection_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  provider_market_id TEXT NOT NULL,
  provider_selection_key TEXT NOT NULL,
  canonical_selection_key TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT provider_selection_mapping_unique UNIQUE (provider, provider_market_id, provider_selection_key)
);

-- 6. Odds Markets Table
CREATE TABLE IF NOT EXISTS public.odds_markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id UUID NOT NULL REFERENCES public.fixtures(id) ON DELETE CASCADE,
  bookmaker_id UUID NOT NULL REFERENCES public.bookmakers(id) ON DELETE RESTRICT,
  market_id UUID REFERENCES public.canonical_markets(id) ON DELETE RESTRICT,
  market_key TEXT NOT NULL,
  market_scope TEXT NOT NULL DEFAULT 'pre_match',
  participant TEXT,
  line_parameter NUMERIC(5, 2),
  status TEXT NOT NULL DEFAULT 'active',
  source_updated_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT odds_markets_unique UNIQUE (fixture_id, bookmaker_id, market_key, market_scope, line_parameter, participant)
);

-- 7. Odds Lines Table
CREATE TABLE IF NOT EXISTS public.odds_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  odds_market_id UUID NOT NULL REFERENCES public.odds_markets(id) ON DELETE CASCADE,
  selection_key TEXT NOT NULL,
  selection_name TEXT NOT NULL,
  price_decimal NUMERIC(10, 3) NOT NULL,
  price_probability NUMERIC(6, 5),
  is_active BOOLEAN NOT NULL DEFAULT true,
  source_updated_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT odds_lines_unique UNIQUE (odds_market_id, selection_key)
);

-- Indexes for Odds
CREATE INDEX IF NOT EXISTS idx_odds_markets_fixture ON public.odds_markets(fixture_id);
CREATE INDEX IF NOT EXISTS idx_odds_markets_bookmaker ON public.odds_markets(bookmaker_id);
CREATE INDEX IF NOT EXISTS idx_odds_lines_market ON public.odds_lines(odds_market_id);

-- Enable RLS on Odds tables
ALTER TABLE public.bookmaker_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_bookmaker_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_market_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_selection_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.odds_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.odds_lines ENABLE ROW LEVEL SECURITY;

-- Read policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read canonical_markets' AND tablename = 'canonical_markets') THEN
    CREATE POLICY "Public read canonical_markets" ON public.canonical_markets FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read market_definitions' AND tablename = 'market_definitions') THEN
    CREATE POLICY "Public read market_definitions" ON public.market_definitions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read odds_markets' AND tablename = 'odds_markets') THEN
    CREATE POLICY "Public read odds_markets" ON public.odds_markets FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read odds_lines' AND tablename = 'odds_lines') THEN
    CREATE POLICY "Public read odds_lines" ON public.odds_lines FOR SELECT USING (true);
  END IF;
END $$;


-- ==============================================================================
-- SECTION 2: PHASE 4D — FOOTBALL INTELLIGENCE, STANDINGS, LINEUPS & STATS
-- ==============================================================================

-- 1. Players Table
CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id UUID NOT NULL REFERENCES public.sports(id) ON DELETE RESTRICT,
  current_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  canonical_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  common_name TEXT,
  position TEXT,
  nationality TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_players_team ON public.players (current_team_id);
CREATE INDEX IF NOT EXISTS idx_players_canonical_name ON public.players (canonical_name);

-- 2. Competition Standings Table
CREATE TABLE IF NOT EXISTS public.competition_standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  group_name TEXT,
  rank INTEGER NOT NULL,
  played INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  goals_for INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  goal_difference INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  form_string TEXT,
  home_played INTEGER NOT NULL DEFAULT 0,
  home_wins INTEGER NOT NULL DEFAULT 0,
  home_draws INTEGER NOT NULL DEFAULT 0,
  home_losses INTEGER NOT NULL DEFAULT 0,
  home_goals_for INTEGER NOT NULL DEFAULT 0,
  home_goals_against INTEGER NOT NULL DEFAULT 0,
  away_played INTEGER NOT NULL DEFAULT 0,
  away_wins INTEGER NOT NULL DEFAULT 0,
  away_draws INTEGER NOT NULL DEFAULT 0,
  away_losses INTEGER NOT NULL DEFAULT 0,
  away_goals_for INTEGER NOT NULL DEFAULT 0,
  away_goals_against INTEGER NOT NULL DEFAULT 0,
  source_updated_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT competition_standings_unique_team UNIQUE (competition_id, season_id, team_id, group_name)
);

CREATE INDEX IF NOT EXISTS idx_standings_competition_season ON public.competition_standings (competition_id, season_id, rank);
CREATE INDEX IF NOT EXISTS idx_standings_team ON public.competition_standings (team_id);

-- 3. Fixture Team Statistics Table
CREATE TABLE IF NOT EXISTS public.fixture_team_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id UUID NOT NULL REFERENCES public.fixtures(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  side TEXT NOT NULL CHECK (side IN ('home', 'away')),
  shots_on_goal INTEGER,
  shots_off_goal INTEGER,
  total_shots INTEGER,
  blocked_shots INTEGER,
  shots_inside_box INTEGER,
  shots_outside_box INTEGER,
  fouls INTEGER,
  corner_kicks INTEGER,
  offsides INTEGER,
  possession_percentage NUMERIC(5, 2),
  yellow_cards INTEGER,
  red_cards INTEGER,
  goalkeeper_saves INTEGER,
  total_passes INTEGER,
  passes_accurate INTEGER,
  passes_percentage NUMERIC(5, 2),
  source_updated_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fixture_team_statistics_unique UNIQUE (fixture_id, team_id)
);

CREATE INDEX IF NOT EXISTS idx_fixture_stats_fixture ON public.fixture_team_statistics (fixture_id);
CREATE INDEX IF NOT EXISTS idx_fixture_stats_team ON public.fixture_team_statistics (team_id);

-- 4. Fixture Lineups Table
CREATE TABLE IF NOT EXISTS public.fixture_lineups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id UUID NOT NULL REFERENCES public.fixtures(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  side TEXT NOT NULL CHECK (side IN ('home', 'away')),
  formation TEXT,
  coach_name TEXT,
  starting_xi JSONB NOT NULL DEFAULT '[]'::jsonb,
  substitutes JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_updated_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fixture_lineups_unique UNIQUE (fixture_id, team_id)
);

CREATE INDEX IF NOT EXISTS idx_fixture_lineups_fixture ON public.fixture_lineups (fixture_id);

-- 5. Player Injuries / Absences Table
CREATE TABLE IF NOT EXISTS public.player_injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id UUID REFERENCES public.fixtures(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  absence_type TEXT NOT NULL DEFAULT 'Missing Fixture',
  source_updated_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_player_injuries_fixture ON public.player_injuries (fixture_id);
CREATE INDEX IF NOT EXISTS idx_player_injuries_team ON public.player_injuries (team_id);

-- 6. Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixture_team_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixture_lineups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_injuries ENABLE ROW LEVEL SECURITY;

-- 7. Read Policies for Public & Authenticated Users
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read players' AND tablename = 'players') THEN
    CREATE POLICY "Public read players" ON public.players FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read competition_standings' AND tablename = 'competition_standings') THEN
    CREATE POLICY "Public read competition_standings" ON public.competition_standings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read fixture_team_statistics' AND tablename = 'fixture_team_statistics') THEN
    CREATE POLICY "Public read fixture_team_statistics" ON public.fixture_team_statistics FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read fixture_lineups' AND tablename = 'fixture_lineups') THEN
    CREATE POLICY "Public read fixture_lineups" ON public.fixture_lineups FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read player_injuries' AND tablename = 'player_injuries') THEN
    CREATE POLICY "Public read player_injuries" ON public.player_injuries FOR SELECT USING (true);
  END IF;
END $$;

-- 8. Service Role Write Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role write players' AND tablename = 'players') THEN
    CREATE POLICY "Service role write players" ON public.players FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role write competition_standings' AND tablename = 'competition_standings') THEN
    CREATE POLICY "Service role write competition_standings" ON public.competition_standings FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role write fixture_team_statistics' AND tablename = 'fixture_team_statistics') THEN
    CREATE POLICY "Service role write fixture_team_statistics" ON public.fixture_team_statistics FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role write fixture_lineups' AND tablename = 'fixture_lineups') THEN
    CREATE POLICY "Service role write fixture_lineups" ON public.fixture_lineups FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role write player_injuries' AND tablename = 'player_injuries') THEN
    CREATE POLICY "Service role write player_injuries" ON public.player_injuries FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;
