import "server-only";

import { GeminiSportsAnalyst, type MatchAnalysisOutput, type TargetOddsOutput } from "@playtoday/ai-tools";
import { TheOddsApiClient } from "@playtoday/bookmaker-adapters";
import { createSupabaseServerClient } from "./supabase/server";

export async function getMatchAnalysis(fixtureId: string): Promise<MatchAnalysisOutput> {
  const supabase = await createSupabaseServerClient();

  // 1. Fetch canonical fixture details
  const { data, error: fixError } = await supabase
    .from("v_public_fixtures")
    .select("*")
    .eq("id", fixtureId)
    .single();

  if (fixError || !data) {
    throw new Error(`Fixture not found for ID: ${fixtureId}`);
  }

  const fixture = data as Record<string, any>;

  // 2. Fetch pre-match odds from bookmaker_odds_current
  const { data: oddsData } = await supabase
    .from("bookmaker_odds_current")
    .select(`
      decimal_odds,
      selection_key,
      sports_market_definitions (name, canonical_key),
      bookmakers (name, key)
    `)
    .eq("fixture_id", fixtureId)
    .limit(10);

  const rawOdds = (oddsData as any[]) ?? [];
  const formattedOdds = rawOdds.map((row: any) => ({
    market: row.sports_market_definitions?.name ?? "Market",
    selection: row.selection_key ?? "Selection",
    price: Number(row.decimal_odds),
    bookmaker: row.bookmakers?.name ?? "Verified Bookmaker",
  }));

  const analyst = new GeminiSportsAnalyst(process.env.GEMINI_API_KEY);

  return await analyst.analyzeMatch({
    fixtureId: String(fixture.id),
    competitionName: String(fixture.competition_name ?? "Football Competition"),
    homeTeamName: String(fixture.home_team_name ?? "Home Team"),
    awayTeamName: String(fixture.away_team_name ?? "Away Team"),
    kickoffAt: String(fixture.kickoff_at ?? new Date().toISOString()),
    venueName: fixture.venue_name ? String(fixture.venue_name) : null,
    round: fixture.round ? String(fixture.round) : null,
    odds: formattedOdds,
  });
}

export async function generateTargetOdds(options: {
  targetMultiplier: number;
  riskTolerance: "conservative" | "balanced" | "aggressive";
}): Promise<TargetOddsOutput> {
  const supabase = await createSupabaseServerClient();

  // 1. Fetch upcoming fixtures with odds from Supabase
  const { data: oddsRows } = await supabase
    .from("bookmaker_odds_current")
    .select(`
      fixture_id,
      decimal_odds,
      selection_key,
      fixtures!inner (
        id,
        kickoff_at,
        competitions!inner (name),
        home_team:teams!fixtures_home_team_id_fkey (name),
        away_team:teams!fixtures_away_team_id_fkey (name)
      ),
      sports_market_definitions (name),
      bookmakers (name)
    `)
    .gte("fixtures.kickoff_at", new Date().toISOString())
    .limit(80);

  const fixtureMap = new Map<string, {
    fixtureId: string;
    title: string;
    competition: string;
    quotes: { market: string; selection: string; price: number; bookmaker: string }[];
  }>();

  const rows = (oddsRows as any[]) ?? [];

  for (const row of rows) {
    const fix = row.fixtures;
    if (!fix) continue;
    const fId = String(fix.id);
    if (!fixtureMap.has(fId)) {
      fixtureMap.set(fId, {
        fixtureId: fId,
        title: `${fix.home_team?.name ?? "Home"} vs ${fix.away_team?.name ?? "Away"}`,
        competition: fix.competitions?.name ?? "League",
        quotes: [],
      });
    }

    fixtureMap.get(fId)?.quotes.push({
      market: row.sports_market_definitions?.name ?? "1X2",
      selection: String(row.selection_key ?? "").replaceAll("_", " "),
      price: Number(row.decimal_odds),
      bookmaker: row.bookmakers?.name ?? "Bookmaker",
    });
  }

  // 2. Fallback / Enrich with live quotes from The Odds API
  const theOddsApiKey = process.env.THE_ODDS_API_KEY;
  if (theOddsApiKey && fixtureMap.size === 0) {
    try {
      const theOddsClient = new TheOddsApiClient(theOddsApiKey);
      const liveQuotes = await theOddsClient.getUpcomingOdds({
        sport: "upcoming",
        regions: "eu,uk",
        markets: "h2h,totals",
      });

      for (const quote of liveQuotes) {
        const fKey = quote.fixtureTitle;
        if (!fixtureMap.has(fKey)) {
          fixtureMap.set(fKey, {
            fixtureId: fKey,
            title: quote.fixtureTitle,
            competition: quote.competition,
            quotes: [],
          });
        }
        fixtureMap.get(fKey)?.quotes.push({
          market: quote.market,
          selection: quote.selection,
          price: quote.price,
          bookmaker: quote.bookmaker,
        });
      }
    } catch (e) {
      console.warn("The Odds API target-odds enrichment failed:", e);
    }
  }

  const analyst = new GeminiSportsAnalyst(process.env.GEMINI_API_KEY);

  return await analyst.generateTargetOdds({
    targetMultiplier: options.targetMultiplier,
    riskTolerance: options.riskTolerance,
    availableFixtures: Array.from(fixtureMap.values()),
  });
}
