-- Phase 8: Production Daily Edge Engine & Official Publication Schema
-- Provides auditable daily publications, immutable odds records, pass-day tracking, and lifecycle states.

CREATE TABLE IF NOT EXISTS public.daily_edge_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_date DATE NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('published', 'pass_day', 'evaluating', 'superseded')),
  target_multiplier NUMERIC(6,3) NOT NULL DEFAULT 2.000,
  original_combined_odds NUMERIC(8,4),
  bookmaker_id UUID REFERENCES public.bookmakers(id) ON DELETE SET NULL,
  bookmaker_name TEXT,
  bookmaker_key TEXT,
  pass_reason_code TEXT CHECK (pass_reason_code IS NULL OR pass_reason_code IN (
    'no_eligible_predictions',
    'insufficient_quality',
    'insufficient_fresh_odds',
    'no_target_compliant_combination',
    'bookmaker_unavailable',
    'provider_data_delayed'
  )),
  pass_reason_text TEXT,
  evaluated_candidate_count INT NOT NULL DEFAULT 0,
  policy_version TEXT NOT NULL DEFAULT 'daily_edge_v1',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_edge_legs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES public.daily_edge_publications(id) ON DELETE CASCADE,
  fixture_id UUID NOT NULL REFERENCES public.fixtures(id) ON DELETE CASCADE,
  prediction_id TEXT,
  market_key TEXT NOT NULL,
  market_name TEXT NOT NULL,
  selection_key TEXT NOT NULL,
  selection_name TEXT NOT NULL,
  line NUMERIC(4,2),
  original_decimal_odds NUMERIC(8,4) NOT NULL,
  model_probability NUMERIC(6,4) NOT NULL,
  kickoff_at TIMESTAMPTZ NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  lifecycle_status TEXT NOT NULL DEFAULT 'scheduled' CHECK (lifecycle_status IN (
    'scheduled',
    'pending',
    'live',
    'postponed',
    'suspended',
    'cancelled',
    'awaiting_settlement'
  )),
  tactical_rationale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_daily_edge_legs_fixture UNIQUE (publication_id, fixture_id)
);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_daily_edge_publications_date ON public.daily_edge_publications (publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_edge_publications_status ON public.daily_edge_publications (status);
CREATE INDEX IF NOT EXISTS idx_daily_edge_legs_pub_order ON public.daily_edge_legs (publication_id, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_daily_edge_legs_fixture ON public.daily_edge_legs (fixture_id);

-- Enable RLS
ALTER TABLE public.daily_edge_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_edge_legs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Read access for published and pass-day records
DROP POLICY IF EXISTS "Allow public read on published daily edge" ON public.daily_edge_publications;
CREATE POLICY "Allow public read on published daily edge"
  ON public.daily_edge_publications
  FOR SELECT
  USING (status IN ('published', 'pass_day'));

DROP POLICY IF EXISTS "Allow public read on published daily edge legs" ON public.daily_edge_legs;
CREATE POLICY "Allow public read on published daily edge legs"
  ON public.daily_edge_legs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.daily_edge_publications p
      WHERE p.id = daily_edge_legs.publication_id
      AND p.status = 'published'
    )
  );

-- System write access through Service Role
DROP POLICY IF EXISTS "Service role full access on daily_edge_publications" ON public.daily_edge_publications;
CREATE POLICY "Service role full access on daily_edge_publications"
  ON public.daily_edge_publications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on daily_edge_legs" ON public.daily_edge_legs;
CREATE POLICY "Service role full access on daily_edge_legs"
  ON public.daily_edge_legs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
