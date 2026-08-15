-- PlayToday Phase 4D: Football Intelligence Schema
-- Standings, Match Statistics, Lineups, Injuries, Players, and Point-in-Time Features

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
CREATE POLICY "Public read players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Public read competition_standings" ON public.competition_standings FOR SELECT USING (true);
CREATE POLICY "Public read fixture_team_statistics" ON public.fixture_team_statistics FOR SELECT USING (true);
CREATE POLICY "Public read fixture_lineups" ON public.fixture_lineups FOR SELECT USING (true);
CREATE POLICY "Public read player_injuries" ON public.player_injuries FOR SELECT USING (true);

-- 8. Service Role Write Policies
CREATE POLICY "Service role write players" ON public.players FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write competition_standings" ON public.competition_standings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write fixture_team_statistics" ON public.fixture_team_statistics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write fixture_lineups" ON public.fixture_lineups FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write player_injuries" ON public.player_injuries FOR ALL USING (auth.role() = 'service_role');
