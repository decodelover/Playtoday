/**
 * PlayToday Phase 8: Production Daily Edge Engine
 *
 * Implements deterministic daily candidate generation, strict quality gates,
 * ~2.00 target combination optimization, and canonical pass-day architecture.
 *
 * ZERO FAKE DATA & NO-FORCE PRINCIPLES:
 * 1. Target proximity NEVER overrides prediction validation or data quality.
 * 2. If no candidate combination meets the strict policy, the engine deterministically
 *    issues an official PASS DAY with humanized, truthful reasoning.
 * 3. Gemini is never used to generate legs, odds, or predictions.
 */

export interface DailyEdgeCandidateLeg {
  fixtureId: string;
  competitionName: string;
  homeTeamName: string;
  awayTeamName: string;
  kickoffAt: string;
  marketKey: string;
  marketName: string;
  selectionKey: string;
  selectionName: string;
  line?: number | null;
  decimalOdds: number;
  bookmakerKey: string;
  bookmakerName: string;
  modelProbability: number;
  tacticalRationale: string;
}

export type PassReasonCode =
  | "no_eligible_predictions"
  | "insufficient_quality"
  | "insufficient_fresh_odds"
  | "no_target_compliant_combination"
  | "bookmaker_unavailable"
  | "provider_data_delayed";

export interface DailyEdgePolicy {
  policyVersion: string;
  targetMultiplier: number;
  targetBandMin: number;
  targetBandMax: number;
  minModelProbability: number;
  minDoubleChanceProbability: number;
  minLegOdds: number;
  maxLegOdds: number;
  maxLegCount: number;
  requireSingleBookmaker: boolean;
  forbidSameFixtureCorrelation: boolean;
}

export const DEFAULT_DAILY_EDGE_POLICY: DailyEdgePolicy = {
  policyVersion: "daily_edge_v1",
  targetMultiplier: 2.00,
  targetBandMin: 1.85,
  targetBandMax: 2.25,
  minModelProbability: 0.55,
  minDoubleChanceProbability: 0.68,
  minLegOdds: 1.25,
  maxLegOdds: 2.25,
  maxLegCount: 2,
  requireSingleBookmaker: true,
  forbidSameFixtureCorrelation: true,
};

export interface DailyEdgeEvaluationOutput {
  status: "published" | "pass_day";
  publicationDate: string; // YYYY-MM-DD
  targetMultiplier: number;
  originalCombinedOdds: number | null;
  bookmakerKey: string | null;
  bookmakerName: string | null;
  legs: DailyEdgeCandidateLeg[];
  passReasonCode: PassReasonCode | null;
  passReasonText: string | null;
  evaluatedCandidateCount: number;
  policyVersion: string;
}

/**
 * Evaluates candidate selections and deterministically generates an official Daily Edge ticket
 * or an official PASS DAY.
 */
export function evaluateDailyEdge(params: {
  publicationDate: string;
  candidateLegs: DailyEdgeCandidateLeg[];
  policy?: Partial<DailyEdgePolicy>;
}): DailyEdgeEvaluationOutput {
  const policy: DailyEdgePolicy = { ...DEFAULT_DAILY_EDGE_POLICY, ...params.policy };
  const { publicationDate, candidateLegs } = params;

  if (!candidateLegs || candidateLegs.length === 0) {
    return {
      status: "pass_day",
      publicationDate,
      targetMultiplier: policy.targetMultiplier,
      originalCombinedOdds: null,
      bookmakerKey: null,
      bookmakerName: null,
      legs: [],
      passReasonCode: "no_eligible_predictions",
      passReasonText: "No eligible pre-match fixtures with verified predictions were available for today's schedule.",
      evaluatedCandidateCount: 0,
      policyVersion: policy.policyVersion,
    };
  }

  // 1. Filter legs strictly meeting quality gates
  const qualifiedLegs = candidateLegs.filter((leg) => {
    // Check odds bounds
    if (leg.decimalOdds < policy.minLegOdds || leg.decimalOdds > policy.maxLegOdds) {
      return false;
    }
    // Check market-specific probability thresholds
    if (leg.marketKey === "double_chance") {
      if (leg.modelProbability < policy.minDoubleChanceProbability) return false;
    } else {
      if (leg.modelProbability < policy.minModelProbability) return false;
    }
    return true;
  });

  if (qualifiedLegs.length === 0) {
    return {
      status: "pass_day",
      publicationDate,
      targetMultiplier: policy.targetMultiplier,
      originalCombinedOdds: null,
      bookmakerKey: null,
      bookmakerName: null,
      legs: [],
      passReasonCode: "insufficient_quality",
      passReasonText: "Available selections did not meet today's strict model confidence and value qualification standards.",
      evaluatedCandidateCount: candidateLegs.length,
      policyVersion: policy.policyVersion,
    };
  }

  // 2. Group qualified legs by Bookmaker
  const legsByBookmaker = new Map<string, DailyEdgeCandidateLeg[]>();
  for (const leg of qualifiedLegs) {
    const list = legsByBookmaker.get(leg.bookmakerKey) ?? [];
    list.push(leg);
    legsByBookmaker.set(leg.bookmakerKey, list);
  }

  // 3. Search for qualifying combinations (~2.00 target band)
  interface TicketCandidate {
    legs: DailyEdgeCandidateLeg[];
    combinedOdds: number;
    combinedProbability: number;
    targetDistance: number;
    bookmakerKey: string;
    bookmakerName: string;
  }

  const validTickets: TicketCandidate[] = [];

  for (const [bmKey, bLegs] of legsByBookmaker.entries()) {
    const bmName = bLegs[0]?.bookmakerName ?? bmKey;

    // A. Evaluate Single-Leg Candidates (1 leg near ~2.00)
    for (const leg of bLegs) {
      if (leg.decimalOdds >= policy.targetBandMin && leg.decimalOdds <= policy.targetBandMax) {
        validTickets.push({
          legs: [leg],
          combinedOdds: Number(leg.decimalOdds.toFixed(4)),
          combinedProbability: leg.modelProbability,
          targetDistance: Math.abs(leg.decimalOdds - policy.targetMultiplier),
          bookmakerKey: bmKey,
          bookmakerName: bmName,
        });
      }
    }

    // B. Evaluate 2-Leg Combinations (2 distinct fixtures)
    for (let i = 0; i < bLegs.length; i++) {
      for (let j = i + 1; j < bLegs.length; j++) {
        const leg1 = bLegs[i]!;
        const leg2 = bLegs[j]!;

        // Forbid same-fixture correlation
        if (policy.forbidSameFixtureCorrelation && leg1.fixtureId === leg2.fixtureId) {
          continue;
        }

        const combinedOdds = Number((leg1.decimalOdds * leg2.decimalOdds).toFixed(4));
        if (combinedOdds >= policy.targetBandMin && combinedOdds <= policy.targetBandMax) {
          const combinedProbability = Number((leg1.modelProbability * leg2.modelProbability).toFixed(4));
          validTickets.push({
            legs: [leg1, leg2],
            combinedOdds,
            combinedProbability,
            targetDistance: Math.abs(combinedOdds - policy.targetMultiplier),
            bookmakerKey: bmKey,
            bookmakerName: bmName,
          });
        }
      }
    }
  }

  // 4. If no candidate ticket meets the target band, issue PASS DAY (NO FORCE RULE)
  if (validTickets.length === 0) {
    return {
      status: "pass_day",
      publicationDate,
      targetMultiplier: policy.targetMultiplier,
      originalCombinedOdds: null,
      bookmakerKey: null,
      bookmakerName: null,
      legs: [],
      passReasonCode: "no_target_compliant_combination",
      passReasonText: "No high-confidence combination satisfied our ~2.00 target odds criteria without compromising quality.",
      evaluatedCandidateCount: candidateLegs.length,
      policyVersion: policy.policyVersion,
    };
  }

  // 5. Rank tickets: Highest combined model probability first, then closest to 2.00 target
  validTickets.sort((a, b) => {
    // 1st priority: Combined statistical probability (higher is safer)
    if (Math.abs(b.combinedProbability - a.combinedProbability) > 0.03) {
      return b.combinedProbability - a.combinedProbability;
    }
    // 2nd priority: Target proximity
    return a.targetDistance - b.targetDistance;
  });

  const bestTicket = validTickets[0]!;

  return {
    status: "published",
    publicationDate,
    targetMultiplier: policy.targetMultiplier,
    originalCombinedOdds: bestTicket.combinedOdds,
    bookmakerKey: bestTicket.bookmakerKey,
    bookmakerName: bestTicket.bookmakerName,
    legs: bestTicket.legs,
    passReasonCode: null,
    passReasonText: null,
    evaluatedCandidateCount: candidateLegs.length,
    policyVersion: policy.policyVersion,
  };
}
