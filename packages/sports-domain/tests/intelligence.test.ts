import { describe, it, expect } from "vitest";
import {
  calculatePointInTimeTeamForm,
  calculatePointInTimeH2H,
  calculatePoissonMatchProbabilities,
  type CanonicalFixtureRecord,
} from "../src/intelligence.js";

describe("Phase 4D Football Intelligence & Probability Engine", () => {
  const mockFixtures: CanonicalFixtureRecord[] = [
    {
      id: "fix-1",
      kickoff_at: "2026-08-01T15:00:00Z",
      status: "finished",
      home_team_id: "team-arsenal",
      away_team_id: "team-chelsea",
      home_score: 2,
      away_score: 1,
      home_team_name: "Arsenal",
      away_team_name: "Chelsea",
      competition_name: "Premier League",
    },
    {
      id: "fix-2",
      kickoff_at: "2026-08-05T15:00:00Z",
      status: "finished",
      home_team_id: "team-liverpool",
      away_team_id: "team-arsenal",
      home_score: 1,
      away_score: 1,
      home_team_name: "Liverpool",
      away_team_name: "Arsenal",
      competition_name: "Premier League",
    },
    {
      id: "fix-3",
      kickoff_at: "2026-08-10T15:00:00Z",
      status: "finished",
      home_team_id: "team-arsenal",
      away_team_id: "team-fulham",
      home_score: 3,
      away_score: 0,
      home_team_name: "Arsenal",
      away_team_name: "Fulham",
      competition_name: "Premier League",
    },
    {
      id: "fix-target",
      kickoff_at: "2026-08-15T15:00:00Z",
      status: "scheduled",
      home_team_id: "team-arsenal",
      away_team_id: "team-chelsea",
      home_score: null,
      away_score: null,
      home_team_name: "Arsenal",
      away_team_name: "Chelsea",
      competition_name: "Premier League",
    },
    {
      id: "fix-chelsea-1",
      kickoff_at: "2026-08-03T15:00:00Z",
      status: "finished",
      home_team_id: "team-chelsea",
      away_team_id: "team-spurs",
      home_score: 2,
      away_score: 2,
      home_team_name: "Chelsea",
      away_team_name: "Tottenham",
      competition_name: "Premier League",
    },
  ];

  it("calculates deterministic team form correctly with sample size", () => {
    const form = calculatePointInTimeTeamForm("team-arsenal", mockFixtures, {
      targetFixtureId: "fix-target",
      limit: 5,
    });

    expect(form.actualSampleSize).toBe(3);
    expect(form.requestedSampleSize).toBe(5);
    // Chronological order from oldest to newest: fix-1 (W 2-1), fix-2 (D 1-1), fix-3 (W 3-0) -> "WDW"
    expect(form.formString).toBe("WDW");
    expect(form.wins).toBe(2);
    expect(form.draws).toBe(1);
    expect(form.losses).toBe(0);
    expect(form.goalsScored).toBe(6);
    expect(form.goalsConceded).toBe(2);
    expect(form.avgGoalsScored).toBe(2.0);
    expect(form.avgGoalsConceded).toBe(0.67);
    expect(form.cleanSheets).toBe(1);
    expect(form.bttsCount).toBe(2);
  });

  it("enforces strict anti-leakage by excluding target fixture and future matches", () => {
    const form = calculatePointInTimeTeamForm("team-arsenal", mockFixtures, {
      targetFixtureId: "fix-target",
      featureCutoff: "2026-08-08T00:00:00Z", // Cutoff before fix-3
    });

    // Only fix-1 and fix-2 are eligible before Aug 8
    expect(form.actualSampleSize).toBe(2);
    expect(form.formString).toBe("WD");
  });

  it("calculates Head-to-Head between two canonical clubs accurately", () => {
    const h2h = calculatePointInTimeH2H("team-arsenal", "team-chelsea", mockFixtures, {
      targetFixtureId: "fix-target",
    });

    expect(h2h.sampleSize).toBe(1);
    expect(h2h.homeWins).toBe(1);
    expect(h2h.draws).toBe(0);
    expect(h2h.awayWins).toBe(0);
    expect(h2h.avgTotalGoals).toBe(3.0);
  });

  it("computes mathematical Poisson probabilities with true 1.00 normalized sum", () => {
    const arsenalForm = calculatePointInTimeTeamForm("team-arsenal", mockFixtures, { limit: 5 });
    const chelseaForm = calculatePointInTimeTeamForm("team-chelsea", mockFixtures, { limit: 5 });

    const probs = calculatePoissonMatchProbabilities(arsenalForm, chelseaForm);

    expect(probs.homeWinProbability).toBeGreaterThan(0);
    expect(probs.drawProbability).toBeGreaterThan(0);
    expect(probs.awayWinProbability).toBeGreaterThan(0);

    const sum1X2 = probs.homeWinProbability + probs.drawProbability + probs.awayWinProbability;
    expect(Math.abs(sum1X2 - 1.0)).toBeLessThanOrEqual(0.01);

    expect(probs.doubleChance1X).toBeCloseTo(probs.homeWinProbability + probs.drawProbability, 2);
    expect(probs.over25Probability).toBeGreaterThan(0);
    expect(probs.bttsProbability).toBeGreaterThan(0);
  });
});
