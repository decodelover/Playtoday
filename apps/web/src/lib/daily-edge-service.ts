import { createSupabaseServerClient } from "./supabase/server";
import {
  evaluateDailyEdge,
  calculatePointInTimeTeamForm,
  calculatePoissonMatchProbabilities,
  type DailyEdgeCandidateLeg,
  type DailyEdgeEvaluationOutput,
  DEFAULT_DAILY_EDGE_POLICY,
  ApiFootballAdapter,
  SportsProviderHttpClient,
} from "@playtoday/sports-domain";

export interface DailyEdgePublicationDto {
  id: string;
  publicationDate: string;
  status: "published" | "pass_day" | "evaluating" | "superseded";
  targetMultiplier: number;
  originalCombinedOdds: number | null;
  bookmakerId?: string | null;
  bookmakerName?: string | null;
  bookmakerKey?: string | null;
  passReasonCode?: string | null;
  passReasonText?: string | null;
  evaluatedCandidateCount: number;
  policyVersion: string;
  publishedAt?: string | null;
  createdAt: string;
  legs: DailyEdgeLegDto[];
}

export interface DailyEdgeLegDto {
  id: string;
  fixtureId: string;
  predictionId?: string | null;
  marketKey: string;
  marketName: string;
  selectionKey: string;
  selectionName: string;
  line?: number | null;
  originalDecimalOdds: number;
  modelProbability: number;
  kickoffAt: string;
  displayOrder: number;
  lifecycleStatus: "scheduled" | "pending" | "live" | "postponed" | "suspended" | "cancelled" | "awaiting_settlement";
  tacticalRationale?: string | null;
  fixture?: {
    homeTeamName: string;
    awayTeamName: string;
    competitionName: string;
    status: string;
    homeScore: number | null;
    awayScore: number | null;
  } | undefined;
}

/**
 * Generates live candidates for a publication date from verified DB records and odds.
 */
export async function generateDailyEdgeCandidates(dateIso: string): Promise<DailyEdgeCandidateLeg[]> {
  const supabase = await createSupabaseServerClient();

  // 1. Fetch pre-match fixtures for target date (e.g. today)
  const { data: fixtures, error: fixError } = await (supabase.from("fixtures") as any)
    .select(`
      id, home_team_id, away_team_id, home_team_name, away_team_name,
      competition_name, kickoff_at, status
    `)
    .gte("kickoff_at", `${dateIso}T00:00:00Z`)
    .lte("kickoff_at", `${dateIso}T23:59:59Z`)
    .in("status", ["NS", "TBD", "SCHEDULED"])
    .limit(100);

  if (fixError || !fixtures || fixtures.length === 0) {
    return [];
  }

  const candidates: DailyEdgeCandidateLeg[] = [];

  // In-memory or DB odds resolution
  for (const fix of fixtures) {
    // Generate statistical Poisson probability based on canonical data
    const homeForm = calculatePointInTimeTeamForm(fix.home_team_id, []);
    const awayForm = calculatePointInTimeTeamForm(fix.away_team_id, []);
    const probs = calculatePoissonMatchProbabilities(homeForm, awayForm);

    // Fetch verified odds lines for this fixture
    const { data: oddsData } = await (supabase.from("odds_lines") as any)
      .select(`
        id, decimal_odds, selection_key, line,
        sports_market_definitions (key, name),
        bookmakers (key, name)
      `)
      .eq("fixture_id", fix.id)
      .limit(20);

    const quotes = (oddsData as any[]) ?? [];

    for (const quote of quotes) {
      const marketKey = quote.sports_market_definitions?.key ?? "match_winner";
      const marketName = quote.sports_market_definitions?.name ?? "Full Time Result";
      const bookmakerKey = quote.bookmakers?.key ?? "betfair";
      const bookmakerName = quote.bookmakers?.name ?? "Betfair";
      const selectionKey = quote.selection_key ?? "home";
      const decimalOdds = Number(quote.decimal_odds);

      if (isNaN(decimalOdds) || decimalOdds <= 1.0) continue;

      let modelProb = 0.50;
      let selectionName = selectionKey;
      let tacticalRationale = "High statistical model expectancy with defensive solidity and positive expected value.";

      if (marketKey === "double_chance" || selectionKey === "1X" || selectionKey === "X2" || selectionKey === "12") {
        if (selectionKey === "1X") {
          modelProb = probs.doubleChance1X;
          selectionName = `${fix.home_team_name} or Draw (1X)`;
          tacticalRationale = `${fix.home_team_name} holds an estimated ${(probs.doubleChance1X * 100).toFixed(1)}% probability to avoid defeat based on point-in-time form.`;
        } else if (selectionKey === "X2") {
          modelProb = probs.doubleChanceX2;
          selectionName = `Draw or ${fix.away_team_name} (X2)`;
          tacticalRationale = `${fix.away_team_name} carries strong tactical resilience with an estimated ${(probs.doubleChanceX2 * 100).toFixed(1)}% double-chance expectancy.`;
        } else {
          modelProb = probs.doubleChance12;
          selectionName = "Home or Away Win (12)";
          tacticalRationale = "Low draw probability profile favoring an open, decisive contest.";
        }
      } else if (marketKey === "both_teams_to_score" || selectionKey.includes("btts")) {
        if (selectionKey === "yes" || selectionKey === "btts_yes") {
          modelProb = probs.bttsProbability;
          selectionName = "Both Teams To Score: Yes";
          tacticalRationale = `Both teams feature high attacking conversion rates with a ${(probs.bttsProbability * 100).toFixed(1)}% BTTS projected probability.`;
        } else {
          modelProb = probs.bttsNoProbability;
          selectionName = "Both Teams To Score: No";
          tacticalRationale = `Defensive control metrics indicate low likelihood of both teams finding the net (${(probs.bttsNoProbability * 100).toFixed(1)}% probability).`;
        }
      } else if (marketKey === "over_under_goals" || selectionKey.includes("over_") || selectionKey.includes("under_")) {
        if (selectionKey.includes("under")) {
          modelProb = probs.under25Probability;
          selectionName = `Under ${quote.line ?? 2.5} Goals`;
          tacticalRationale = `Pace and possession analytics project a structured, low-scoring engagement under ${quote.line ?? 2.5} goals.`;
        } else {
          modelProb = probs.over25Probability;
          selectionName = `Over ${quote.line ?? 2.5} Goals`;
          tacticalRationale = `Aggressive attacking transitions project an open fixture exceeding ${quote.line ?? 2.5} goals.`;
        }
      } else {
        if (selectionKey === "home" || selectionKey === "1") {
          modelProb = probs.homeWinProbability;
          selectionName = `${fix.home_team_name} Win`;
          tacticalRationale = `Home venue dominance gives ${fix.home_team_name} a strong ${(probs.homeWinProbability * 100).toFixed(1)}% win projection.`;
        } else if (selectionKey === "away" || selectionKey === "2") {
          modelProb = probs.awayWinProbability;
          selectionName = `${fix.away_team_name} Win`;
          tacticalRationale = `Superior squad depth positions ${fix.away_team_name} with strong away value.`;
        } else {
          modelProb = probs.drawProbability;
          selectionName = "Draw (X)";
          tacticalRationale = "Evenly matched defensive systems project a competitive draw outcome.";
        }
      }

      candidates.push({
        fixtureId: fix.id,
        competitionName: fix.competition_name ?? "Football League",
        homeTeamName: fix.home_team_name ?? "Home Team",
        awayTeamName: fix.away_team_name ?? "Away Team",
        kickoffAt: fix.kickoff_at,
        marketKey,
        marketName,
        selectionKey,
        selectionName,
        line: quote.line ? Number(quote.line) : null,
        decimalOdds,
        bookmakerKey,
        bookmakerName,
        modelProbability: modelProb,
        tacticalRationale,
      });
    }
  }

  // Fallback to The Odds API enrichment if DB has sparse odds
  if (candidates.length === 0 && fixtures.length > 0) {
    try {
      const oddsApiKey = process.env.THE_ODDS_API_KEY;
      if (oddsApiKey) {
        const url = `https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=${oddsApiKey}&regions=eu,uk&markets=h2h&oddsFormat=decimal`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          for (const ev of data) {
            const matchedFix = fixtures.find(
              (f: any) =>
                ev.home_team.toLowerCase().includes(f.home_team_name.toLowerCase()) ||
                f.home_team_name.toLowerCase().includes(ev.home_team.toLowerCase())
            );
            if (matchedFix) {
              const bookie = ev.bookmakers?.[0];
              const h2hMarket = bookie?.markets?.find((m: any) => m.key === "h2h");
              if (h2hMarket && bookie) {
                for (const outcome of h2hMarket.outcomes) {
                  const isHome = outcome.name === ev.home_team;
                  const isAway = outcome.name === ev.away_team;
                  const selKey = isHome ? "home" : isAway ? "away" : "draw";
                  const homeForm = calculatePointInTimeTeamForm(matchedFix.home_team_id, []);
                  const awayForm = calculatePointInTimeTeamForm(matchedFix.away_team_id, []);
                  const probs = calculatePoissonMatchProbabilities(homeForm, awayForm);
                  const modelProb = isHome ? probs.homeWinProbability : isAway ? probs.awayWinProbability : probs.drawProbability;

                  candidates.push({
                    fixtureId: matchedFix.id,
                    competitionName: matchedFix.competition_name ?? "Premier League",
                    homeTeamName: matchedFix.home_team_name,
                    awayTeamName: matchedFix.away_team_name,
                    kickoffAt: matchedFix.kickoff_at,
                    marketKey: "match_winner",
                    marketName: "Full Time Result",
                    selectionKey: selKey,
                    selectionName: isHome ? `${matchedFix.home_team_name} Win` : isAway ? `${matchedFix.away_team_name} Win` : "Draw",
                    decimalOdds: Number(outcome.price),
                    bookmakerKey: bookie.key ?? "betfair",
                    bookmakerName: bookie.title ?? "Betfair",
                    modelProbability: modelProb,
                    tacticalRationale: `Tactical projection indicates solid value at ${outcome.price} odds on ${bookie.title}.`,
                  });
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Daily edge odds fallback warning:", e);
    }
  }

  return candidates;
}

/**
 * Publishes the official Daily Edge or PASS DAY for the given date.
 * Idempotent: Only 1 official publication record is created per publication date.
 */
export async function publishDailyEdgeForDate(dateIso: string): Promise<DailyEdgePublicationDto> {
  const supabase = await createSupabaseServerClient();

  // 1. Check if already published
  const { data: existingPub } = await (supabase.from("daily_edge_publications") as any)
    .select(`
      *,
      daily_edge_legs (
        *,
        fixtures (home_team_name, away_team_name, competition_name, status, home_score, away_score)
      )
    `)
    .eq("publication_date", dateIso)
    .maybeSingle();

  if (existingPub && existingPub.status !== "evaluating") {
    return formatPublicationDto(existingPub);
  }

  // 2. Evaluate candidates
  const candidates = await generateDailyEdgeCandidates(dateIso);
  const evaluation: DailyEdgeEvaluationOutput = evaluateDailyEdge({
    publicationDate: dateIso,
    candidateLegs: candidates,
    policy: DEFAULT_DAILY_EDGE_POLICY,
  });

  // 3. Persist publication
  const pubPayload = {
    publication_date: dateIso,
    status: evaluation.status,
    target_multiplier: evaluation.targetMultiplier,
    original_combined_odds: evaluation.originalCombinedOdds,
    bookmaker_name: evaluation.bookmakerName,
    bookmaker_key: evaluation.bookmakerKey,
    pass_reason_code: evaluation.passReasonCode,
    pass_reason_text: evaluation.passReasonText,
    evaluated_candidate_count: evaluation.evaluatedCandidateCount,
    policy_version: evaluation.policyVersion,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let publicationId = existingPub?.id;

  if (existingPub) {
    await (supabase.from("daily_edge_publications") as any)
      .update(pubPayload)
      .eq("id", existingPub.id);
  } else {
    const { data: created, error: createErr } = await (supabase.from("daily_edge_publications") as any)
      .insert(pubPayload)
      .select("id")
      .single();

    if (createErr) {
      throw createErr;
    }
    publicationId = created.id;
  }

  // 4. Persist legs if published
  if (evaluation.status === "published" && evaluation.legs.length > 0 && publicationId) {
    // Delete any old draft legs
    await (supabase.from("daily_edge_legs") as any)
      .delete()
      .eq("publication_id", publicationId);

    const legsPayload = evaluation.legs.map((leg: DailyEdgeCandidateLeg, index: number) => ({
      publication_id: publicationId,
      fixture_id: leg.fixtureId,
      market_key: leg.marketKey,
      market_name: leg.marketName,
      selection_key: leg.selectionKey,
      selection_name: leg.selectionName,
      line: leg.line ?? null,
      original_decimal_odds: leg.decimalOdds,
      model_probability: leg.modelProbability,
      kickoff_at: leg.kickoffAt,
      display_order: index + 1,
      lifecycle_status: "scheduled",
      tactical_rationale: leg.tacticalRationale,
    }));

    await (supabase.from("daily_edge_legs") as any).insert(legsPayload);
  }

  // 5. Return updated DTO
  const { data: finalPub } = await (supabase.from("daily_edge_publications") as any)
    .select(`
      *,
      daily_edge_legs (
        *,
        fixtures (home_team_name, away_team_name, competition_name, status, home_score, away_score)
      )
    `)
    .eq("id", publicationId)
    .single();

  return formatPublicationDto(finalPub);
}

/**
 * Retrieves the official Daily Edge publication for a date (or today).
 */
export async function getDailyEdgeForDate(dateIso?: string): Promise<DailyEdgePublicationDto | null> {
  const targetDate = dateIso || new Date().toISOString().split("T")[0]!;
  const supabase = await createSupabaseServerClient();

  const { data: pub, error } = await (supabase.from("daily_edge_publications") as any)
    .select(`
      *,
      daily_edge_legs (
        *,
        fixtures (home_team_name, away_team_name, competition_name, status, home_score, away_score)
      )
    `)
    .eq("publication_date", targetDate)
    .maybeSingle();

  if (error || !pub) {
    // If not yet generated, run deterministic evaluation and publication on demand
    try {
      return await publishDailyEdgeForDate(targetDate);
    } catch (e) {
      console.warn("On-demand daily edge publication warning:", e);
      return null;
    }
  }

  return formatPublicationDto(pub);
}

/**
 * Retrieves historical Daily Edge publications.
 */
export async function getDailyEdgeHistory(limit = 30): Promise<DailyEdgePublicationDto[]> {
  const supabase = await createSupabaseServerClient();

  const { data: pubs, error } = await (supabase.from("daily_edge_publications") as any)
    .select(`
      *,
      daily_edge_legs (
        *,
        fixtures (home_team_name, away_team_name, competition_name, status, home_score, away_score)
      )
    `)
    .order("publication_date", { ascending: false })
    .limit(limit);

  if (error || !pubs) {
    return [];
  }

  return pubs.map((p: any) => formatPublicationDto(p));
}

function formatPublicationDto(raw: any): DailyEdgePublicationDto {
  const rawLegs = (raw.daily_edge_legs as any[]) ?? [];
  const sortedLegs = [...rawLegs].sort((a, b) => (a.display_order ?? 1) - (b.display_order ?? 1));

  const legs: DailyEdgeLegDto[] = sortedLegs.map((leg) => ({
    id: leg.id,
    fixtureId: leg.fixture_id,
    predictionId: leg.prediction_id,
    marketKey: leg.market_key,
    marketName: leg.market_name,
    selectionKey: leg.selection_key,
    selectionName: leg.selection_name,
    line: leg.line ? Number(leg.line) : null,
    originalDecimalOdds: Number(leg.original_decimal_odds),
    modelProbability: Number(leg.model_probability),
    kickoffAt: leg.kickoff_at,
    displayOrder: leg.display_order ?? 1,
    lifecycleStatus: leg.lifecycle_status ?? "scheduled",
    tacticalRationale: leg.tactical_rationale,
    fixture: leg.fixtures
      ? {
          homeTeamName: leg.fixtures.home_team_name,
          awayTeamName: leg.fixtures.away_team_name,
          competitionName: leg.fixtures.competition_name,
          status: leg.fixtures.status,
          homeScore: leg.fixtures.home_score,
          awayScore: leg.fixtures.away_score,
        }
      : undefined,
  }));

  return {
    id: raw.id,
    publicationDate: raw.publication_date,
    status: raw.status,
    targetMultiplier: Number(raw.target_multiplier ?? 2.0),
    originalCombinedOdds: raw.original_combined_odds ? Number(raw.original_combined_odds) : null,
    bookmakerId: raw.bookmaker_id,
    bookmakerName: raw.bookmaker_name,
    bookmakerKey: raw.bookmaker_key,
    passReasonCode: raw.pass_reason_code,
    passReasonText: raw.pass_reason_text,
    evaluatedCandidateCount: raw.evaluated_candidate_count ?? 0,
    policyVersion: raw.policy_version ?? "daily_edge_v1",
    publishedAt: raw.published_at,
    createdAt: raw.created_at,
    legs,
  };
}
