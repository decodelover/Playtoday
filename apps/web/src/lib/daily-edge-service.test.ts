import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  evaluateDailyEdge,
  DEFAULT_DAILY_EDGE_POLICY,
} from "@playtoday/sports-domain";

describe("Phase 8: Daily Edge Web Service & Policies", () => {
  it("uses versioned daily_edge_v1 policy by default", () => {
    expect(DEFAULT_DAILY_EDGE_POLICY.policyVersion).toBe("daily_edge_v1");
    expect(DEFAULT_DAILY_EDGE_POLICY.targetMultiplier).toBe(2.0);
    expect(DEFAULT_DAILY_EDGE_POLICY.targetBandMin).toBe(1.85);
    expect(DEFAULT_DAILY_EDGE_POLICY.targetBandMax).toBe(2.25);
  });

  it("produces deterministic output for identical candidate inputs", () => {
    const legs = [
      {
        fixtureId: "f1",
        competitionName: "EPL",
        homeTeamName: "Liverpool",
        awayTeamName: "Bournemouth",
        kickoffAt: "2026-08-16T14:00:00Z",
        marketKey: "match_winner",
        marketName: "Full Time Result",
        selectionKey: "home",
        selectionName: "Liverpool Win",
        decimalOdds: 1.40,
        bookmakerKey: "betfair",
        bookmakerName: "Betfair",
        modelProbability: 0.78,
        tacticalRationale: "Liverpool dominates home shot volume.",
      },
      {
        fixtureId: "f2",
        competitionName: "Bundesliga",
        homeTeamName: "Bayern Munich",
        awayTeamName: "Augsburg",
        kickoffAt: "2026-08-16T16:30:00Z",
        marketKey: "match_winner",
        marketName: "Full Time Result",
        selectionKey: "home",
        selectionName: "Bayern Munich Win",
        decimalOdds: 1.42,
        bookmakerKey: "betfair",
        bookmakerName: "Betfair",
        modelProbability: 0.80,
        tacticalRationale: "Bayern expected goals conversion exceeds 2.4.",
      },
    ];

    const run1 = evaluateDailyEdge({ publicationDate: "2026-08-16", candidateLegs: legs });
    const run2 = evaluateDailyEdge({ publicationDate: "2026-08-16", candidateLegs: legs });

    expect(run1.status).toBe("published");
    expect(run1.originalCombinedOdds).toBe(run2.originalCombinedOdds);
    expect(run1.legs.length).toBe(run2.legs.length);
    expect(run1.bookmakerKey).toBe(run2.bookmakerKey);
  });

  it("handles pass-day reason codes cleanly and truthfully", () => {
    const result = evaluateDailyEdge({
      publicationDate: "2026-08-16",
      candidateLegs: [],
    });

    expect(result.status).toBe("pass_day");
    expect(result.passReasonCode).toBe("no_eligible_predictions");
    expect(typeof result.passReasonText).toBe("string");
  });
});
