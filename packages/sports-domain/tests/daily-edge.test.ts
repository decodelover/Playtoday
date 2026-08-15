import { describe, it, expect } from "vitest";
import {
  evaluateDailyEdge,
  DEFAULT_DAILY_EDGE_POLICY,
  type DailyEdgeCandidateLeg,
} from "../src/daily-edge.js";

describe("Phase 8: Daily Edge Domain Engine", () => {
  const sampleLeg1: DailyEdgeCandidateLeg = {
    fixtureId: "fix-001",
    competitionName: "Premier League",
    homeTeamName: "Arsenal",
    awayTeamName: "Chelsea",
    kickoffAt: "2026-08-16T15:00:00Z",
    marketKey: "double_chance",
    marketName: "Double Chance",
    selectionKey: "1X",
    selectionName: "Arsenal or Draw (1X)",
    decimalOdds: 1.42,
    bookmakerKey: "betfair",
    bookmakerName: "Betfair",
    modelProbability: 0.76,
    tacticalRationale: "Arsenal has strong home form and defensive depth.",
  };

  const sampleLeg2: DailyEdgeCandidateLeg = {
    fixtureId: "fix-002",
    competitionName: "La Liga",
    homeTeamName: "Real Madrid",
    awayTeamName: "Sevilla",
    kickoffAt: "2026-08-16T19:00:00Z",
    marketKey: "match_winner",
    marketName: "Full Time Result",
    selectionKey: "home",
    selectionName: "Real Madrid Win",
    decimalOdds: 1.45,
    bookmakerKey: "betfair",
    bookmakerName: "Betfair",
    modelProbability: 0.72,
    tacticalRationale: "High home expectancy and high conversion rate.",
  };

  const sampleSingle200Leg: DailyEdgeCandidateLeg = {
    fixtureId: "fix-003",
    competitionName: "Serie A",
    homeTeamName: "Inter Milan",
    awayTeamName: "Juventus",
    kickoffAt: "2026-08-16T19:45:00Z",
    marketKey: "match_winner",
    marketName: "Full Time Result",
    selectionKey: "home",
    selectionName: "Inter Milan Win",
    decimalOdds: 2.05,
    bookmakerKey: "betfair",
    bookmakerName: "Betfair",
    modelProbability: 0.60,
    tacticalRationale: "Inter holds a 60% probability with 2.05 odds value.",
  };

  it("publishes a qualifying 2-leg combination near ~2.00 target odds", () => {
    const result = evaluateDailyEdge({
      publicationDate: "2026-08-16",
      candidateLegs: [sampleLeg1, sampleLeg2],
    });

    expect(result.status).toBe("published");
    expect(result.originalCombinedOdds).toBeCloseTo(2.059, 2);
    expect(result.legs.length).toBe(2);
    expect(result.bookmakerKey).toBe("betfair");
    expect(result.passReasonCode).toBeNull();
  });

  it("publishes a single high-value leg if it falls in the ~2.00 target band", () => {
    const result = evaluateDailyEdge({
      publicationDate: "2026-08-16",
      candidateLegs: [sampleSingle200Leg],
    });

    expect(result.status).toBe("published");
    expect(result.originalCombinedOdds).toBe(2.05);
    expect(result.legs.length).toBe(1);
    expect(result.legs[0]?.fixtureId).toBe("fix-003");
  });

  it("enforces NO-FORCE rule: publishes PASS DAY when available odds do not meet target band", () => {
    const lowOddsLeg: DailyEdgeCandidateLeg = {
      ...sampleLeg1,
      decimalOdds: 1.30,
    };

    // Only 1 leg with 1.30 odds (outside target band 1.85 - 2.25)
    const result = evaluateDailyEdge({
      publicationDate: "2026-08-16",
      candidateLegs: [lowOddsLeg],
    });

    expect(result.status).toBe("pass_day");
    expect(result.originalCombinedOdds).toBeNull();
    expect(result.legs.length).toBe(0);
    expect(result.passReasonCode).toBe("no_target_compliant_combination");
    expect(result.passReasonText).toContain("target odds criteria");
  });

  it("enforces quality gate: discards low probability legs and issues PASS DAY", () => {
    const lowProbLeg: DailyEdgeCandidateLeg = {
      ...sampleSingle200Leg,
      modelProbability: 0.35, // Below 0.55 minimum threshold
    };

    const result = evaluateDailyEdge({
      publicationDate: "2026-08-16",
      candidateLegs: [lowProbLeg],
    });

    expect(result.status).toBe("pass_day");
    expect(result.passReasonCode).toBe("insufficient_quality");
  });

  it("forbids same-fixture correlation: does not combine two selections from same match", () => {
    const sameFixLeg1: DailyEdgeCandidateLeg = {
      ...sampleLeg1,
      fixtureId: "fix-same",
      decimalOdds: 1.42,
    };
    const sameFixLeg2: DailyEdgeCandidateLeg = {
      ...sampleLeg2,
      fixtureId: "fix-same", // Same fixture!
      decimalOdds: 1.45,
    };

    const result = evaluateDailyEdge({
      publicationDate: "2026-08-16",
      candidateLegs: [sameFixLeg1, sameFixLeg2],
    });

    // Since they are from the same fixture, combining them is forbidden -> no valid ticket -> pass_day
    expect(result.status).toBe("pass_day");
    expect(result.passReasonCode).toBe("no_target_compliant_combination");
  });

  it("enforces single bookmaker rule: does not combine selections from different bookmakers", () => {
    const betfairLeg: DailyEdgeCandidateLeg = {
      ...sampleLeg1,
      bookmakerKey: "betfair",
    };
    const sportybetLeg: DailyEdgeCandidateLeg = {
      ...sampleLeg2,
      bookmakerKey: "sportybet",
    };

    const result = evaluateDailyEdge({
      publicationDate: "2026-08-16",
      candidateLegs: [betfairLeg, sportybetLeg],
    });

    // Cannot combine across different bookmakers -> no valid combination within 1 bookmaker -> pass_day
    expect(result.status).toBe("pass_day");
  });

  it("handles empty candidate array by issuing PASS DAY with no_eligible_predictions", () => {
    const result = evaluateDailyEdge({
      publicationDate: "2026-08-16",
      candidateLegs: [],
    });

    expect(result.status).toBe("pass_day");
    expect(result.passReasonCode).toBe("no_eligible_predictions");
  });
});
