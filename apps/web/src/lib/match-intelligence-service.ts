import { createSupabaseServerClient } from "./supabase/server";
import {
  calculatePointInTimeTeamForm,
  calculatePointInTimeH2H,
  calculatePoissonMatchProbabilities,
  type DerivedTeamForm,
  type DerivedH2HSummary,
  type PoissonMatchProbabilities,
  type StandingsRowDto,
  type MatchStatisticsDto,
  type MatchLineupDto,
  type MatchInjuryDto,
  type CanonicalFixtureRecord,
} from "@playtoday/sports-domain";
import { ApiFootballAdapter } from "@playtoday/sports-domain";
import { SportsProviderHttpClient } from "@playtoday/sports-domain";

export interface MatchIntelligenceData {
  fixture: {
    id: string;
    kickoffAt: string;
    status: string;
    statusDetail?: string | null;
    homeScore: number | null;
    awayScore: number | null;
    halftimeHomeScore: number | null;
    halftimeAwayScore: number | null;
    matchday?: number | null;
    round?: string | null;
    competition: {
      id: string;
      name: string;
      canonicalKey: string;
      logoUrl?: string | null;
    };
    homeTeam: {
      id: string;
      name: string;
      shortName?: string | null;
      logoUrl?: string | null;
    };
    awayTeam: {
      id: string;
      name: string;
      shortName?: string | null;
      logoUrl?: string | null;
    };
    venue?: {
      name?: string | null;
      city?: string | null;
    } | null;
  };
  homeForm: DerivedTeamForm;
  awayForm: DerivedTeamForm;
  homeVenueForm: DerivedTeamForm;
  awayVenueForm: DerivedTeamForm;
  headToHead: DerivedH2HSummary;
  probabilities: PoissonMatchProbabilities;
  standings: StandingsRowDto[];
  statistics: MatchStatisticsDto[];
  lineups: MatchLineupDto[];
  injuries: MatchInjuryDto[];
  dataCompleteness: {
    hasStandings: boolean;
    hasLineups: boolean;
    hasStatistics: boolean;
    hasInjuries: boolean;
    hasOdds: boolean;
  };
}

// In-memory caching for external provider queries (5 min TTL)
const cache = new Map<string, { data: any; expiresAt: number }>();

function getCached<T>(key: string): T | null {
  const item = cache.get(key);
  if (item && item.expiresAt > Date.now()) {
    return item.data as T;
  }
  return null;
}

function setCached<T>(key: string, data: T, ttlMs = 300000): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

function getProviderAdapter(): ApiFootballAdapter | null {
  const apiKey = process.env.SPORTS_PROVIDER_API_KEY;
  if (!apiKey) return null;
  const baseUrl = process.env.SPORTS_PROVIDER_BASE_URL || "https://v3.football.api-sports.io";
  const httpClient = new SportsProviderHttpClient({ baseUrl, apiKey });
  return new ApiFootballAdapter(httpClient);
}

export async function getMatchIntelligence(fixtureId: string): Promise<MatchIntelligenceData | null> {
  const supabase = await createSupabaseServerClient();

  // 1. Fetch target fixture
  const { data: fixtureRow, error: fixtureError } = await (supabase.from("fixtures") as any)
    .select(`
      id,
      kickoff_at,
      status,
      status_detail,
      home_score,
      away_score,
      halftime_home_score,
      halftime_away_score,
      matchday,
      round,
      competition_id,
      home_team_id,
      away_team_id,
      venue_id,
      competitions ( id, name, canonical_key, logo_url ),
      home_team:teams!fixtures_home_team_id_fkey ( id, canonical_name, short_name, logo_url ),
      away_team:teams!fixtures_away_team_id_fkey ( id, canonical_name, short_name, logo_url ),
      venues ( name, city )
    `)
    .eq("id", fixtureId)
    .single();

  if (fixtureError || !fixtureRow) {
    return null;
  }

  const competition = fixtureRow.competitions ?? { id: fixtureRow.competition_id, name: "Football League", canonical_key: "league" };
  const homeTeam = fixtureRow.home_team ?? { id: fixtureRow.home_team_id, canonical_name: "Home Team" };
  const awayTeam = fixtureRow.away_team ?? { id: fixtureRow.away_team_id, canonical_name: "Away Team" };

  // 2. Fetch all canonical fixtures for these 2 teams to calculate pure deterministic form & H2H
  const { data: teamFixtures } = await (supabase.from("fixtures") as any)
    .select(`
      id,
      kickoff_at,
      status,
      home_team_id,
      away_team_id,
      home_score,
      away_score,
      home_team:teams!fixtures_home_team_id_fkey ( canonical_name ),
      away_team:teams!fixtures_away_team_id_fkey ( canonical_name ),
      competitions ( name )
    `)
    .or(`home_team_id.eq.${homeTeam.id},away_team_id.eq.${homeTeam.id},home_team_id.eq.${awayTeam.id},away_team_id.eq.${awayTeam.id}`)
    .order("kickoff_at", { ascending: false })
    .limit(100);

  const canonicalRecords: CanonicalFixtureRecord[] = (teamFixtures ?? []).map((f: any) => ({
    id: f.id,
    kickoff_at: f.kickoff_at,
    status: f.status,
    home_team_id: f.home_team_id,
    away_team_id: f.away_team_id,
    home_score: f.home_score,
    away_score: f.away_score,
    home_team_name: f.home_team?.canonical_name,
    away_team_name: f.away_team?.canonical_name,
    competition_name: f.competitions?.name,
  }));

  // 3. Compute deterministic Point-in-Time Form & H2H (Strict Anti-Leakage)
  const homeForm = calculatePointInTimeTeamForm(homeTeam.id, canonicalRecords, {
    targetFixtureId: fixtureId,
    limit: 5,
  });

  const awayForm = calculatePointInTimeTeamForm(awayTeam.id, canonicalRecords, {
    targetFixtureId: fixtureId,
    limit: 5,
  });

  const homeVenueForm = calculatePointInTimeTeamForm(homeTeam.id, canonicalRecords, {
    targetFixtureId: fixtureId,
    venueFilter: "home_only",
    limit: 5,
  });

  const awayVenueForm = calculatePointInTimeTeamForm(awayTeam.id, canonicalRecords, {
    targetFixtureId: fixtureId,
    venueFilter: "away_only",
    limit: 5,
  });

  const headToHead = calculatePointInTimeH2H(homeTeam.id, awayTeam.id, canonicalRecords, {
    targetFixtureId: fixtureId,
    limit: 5,
  });

  // 4. Calculate Mathematical Poisson Probabilities
  const probabilities = calculatePoissonMatchProbabilities(homeForm, awayForm);

  // 5. Query Provider Entity Mappings for External Live Data (Standings, Stats, Lineups, Injuries)
  const adapter = getProviderAdapter();
  let standings: StandingsRowDto[] = [];
  let statistics: MatchStatisticsDto[] = [];
  let lineups: MatchLineupDto[] = [];
  let injuries: MatchInjuryDto[] = [];

  if (adapter) {
    try {
      // Find provider IDs
      const { data: mappings } = await (supabase.from("provider_entity_mappings") as any)
        .select("entity_type, canonical_entity_id, provider_entity_id")
        .in("canonical_entity_id", [fixtureId, competition.id]);

      const fixtureMapping = mappings?.find((m: any) => m.entity_type === "fixture");
      const compMapping = mappings?.find((m: any) => m.entity_type === "competition");

      // A. Standings
      if (compMapping) {
        const cacheKey = `standings_${compMapping.provider_entity_id}`;
        const cachedStandings = getCached<StandingsRowDto[]>(cacheKey);
        if (cachedStandings) {
          standings = cachedStandings;
        } else {
          standings = await adapter.getStandings(compMapping.provider_entity_id);
          setCached(cacheKey, standings, 600000); // 10 min cache
        }
      }

      // B. Lineups, Stats & Injuries for target fixture
      if (fixtureMapping) {
        const pFixtureId = fixtureMapping.provider_entity_id;

        // Lineups
        const lineupsCacheKey = `lineups_${pFixtureId}`;
        const cachedLineups = getCached<MatchLineupDto[]>(lineupsCacheKey);
        if (cachedLineups) {
          lineups = cachedLineups;
        } else {
          lineups = await adapter.getFixtureLineups(pFixtureId);
          setCached(lineupsCacheKey, lineups, 180000);
        }

        // Stats (if live or finished)
        if (fixtureRow.status === "finished" || fixtureRow.status === "live" || fixtureRow.status === "halftime") {
          const statsCacheKey = `stats_${pFixtureId}`;
          const cachedStats = getCached<MatchStatisticsDto[]>(statsCacheKey);
          if (cachedStats) {
            statistics = cachedStats;
          } else {
            statistics = await adapter.getFixtureStatistics(pFixtureId);
            setCached(statsCacheKey, statistics, 60000);
          }
        }

        // Injuries
        const injuriesCacheKey = `injuries_${pFixtureId}`;
        const cachedInjuries = getCached<MatchInjuryDto[]>(injuriesCacheKey);
        if (cachedInjuries) {
          injuries = cachedInjuries;
        } else {
          injuries = await adapter.getFixtureInjuries(pFixtureId);
          setCached(injuriesCacheKey, injuries, 300000);
        }
      }
    } catch (err) {
      console.warn("External provider intelligence fetch partial failure:", err);
    }
  }

  // 6. Check Odds presence
  const { count: oddsCount } = await (supabase.from("current_odds") as any)
    .select("id", { count: "exact", head: true })
    .eq("fixture_id", fixtureId);

  return {
    fixture: {
      id: fixtureRow.id,
      kickoffAt: fixtureRow.kickoff_at,
      status: fixtureRow.status,
      statusDetail: fixtureRow.status_detail,
      homeScore: fixtureRow.home_score,
      awayScore: fixtureRow.away_score,
      halftimeHomeScore: fixtureRow.halftime_home_score,
      halftimeAwayScore: fixtureRow.halftime_away_score,
      matchday: fixtureRow.matchday,
      round: fixtureRow.round,
      competition: {
        id: competition.id,
        name: competition.name,
        canonicalKey: competition.canonical_key,
        logoUrl: competition.logo_url,
      },
      homeTeam: {
        id: homeTeam.id,
        name: homeTeam.canonical_name,
        shortName: homeTeam.short_name,
        logoUrl: homeTeam.logo_url,
      },
      awayTeam: {
        id: awayTeam.id,
        name: awayTeam.canonical_name,
        shortName: awayTeam.short_name,
        logoUrl: awayTeam.logo_url,
      },
      venue: fixtureRow.venues,
    },
    homeForm,
    awayForm,
    homeVenueForm,
    awayVenueForm,
    headToHead,
    probabilities,
    standings,
    statistics,
    lineups,
    injuries,
    dataCompleteness: {
      hasStandings: standings.length > 0,
      hasLineups: lineups.length > 0 && lineups.some((l) => l.startingXI.length > 0),
      hasStatistics: statistics.length > 0,
      hasInjuries: injuries.length > 0,
      hasOdds: (oddsCount ?? 0) > 0,
    },
  };
}
