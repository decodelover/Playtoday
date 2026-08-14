import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createSupabaseServerClient: vi.fn(),
  from: vi.fn(),
  select: vi.fn(),
  gte: vi.fn(),
  lte: vi.fn(),
  order: vi.fn(),
  eq: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("./supabase/server", () => ({
  createSupabaseServerClient: mocks.createSupabaseServerClient,
}));

import {
  getLocalDateIso,
  getTodaysGames,
  getUtcBoundsForTimezone,
} from "./games-service";

describe("Games Service - Timezone Boundary Calculations", () => {
  it("computes exact UTC range for UTC timezone calendar day", () => {
    const { startUtc, endUtc } = getUtcBoundsForTimezone("2026-08-15", "UTC");
    expect(startUtc).toBe("2026-08-15T00:00:00.000Z");
    expect(endUtc).toBe("2026-08-15T23:59:59.999Z");
  });

  it("handles Africa/Lagos (UTC+1) timezone shift correctly", () => {
    const { startUtc, endUtc } = getUtcBoundsForTimezone("2026-08-15", "Africa/Lagos");
    expect(startUtc).toBe("2026-08-14T23:00:00.000Z");
    expect(endUtc).toBe("2026-08-15T22:59:59.999Z");
  });

  it("handles daylight-saving transitions without assuming a fixed offset", () => {
    const { startUtc, endUtc } = getUtcBoundsForTimezone(
      "2026-03-08",
      "America/New_York",
    );
    expect(startUtc).toBe("2026-03-08T05:00:00.000Z");
    expect(endUtc).toBe("2026-03-09T03:59:59.999Z");
  });

  it("derives today from the user's timezone", () => {
    expect(getLocalDateIso(new Date("2026-08-14T23:30:00.000Z"), "Africa/Lagos")).toBe(
      "2026-08-15",
    );
  });

  it("fallback safely when invalid timezone or date string is provided", () => {
    const { startUtc, endUtc } = getUtcBoundsForTimezone(
      "2026-08-15",
      "Invalid/Timezone_Key",
    );
    expect(startUtc).toBe("2026-08-15T00:00:00.000Z");
    expect(endUtc).toBe("2026-08-15T23:59:59.999Z");
  });
});

describe("Games Service - getTodaysGames Querying", () => {
  it("returns empty fixture set with unavailable freshness on database error", async () => {
    mocks.createSupabaseServerClient.mockResolvedValueOnce({
      from: () => ({
        select: () => ({
          gte: () => ({
            lte: () => ({
              order: () => Promise.resolve({ data: null, error: new Error("DB down") }),
            }),
          }),
        }),
      }),
    });

    const result = await getTodaysGames({ userTimezone: "UTC", dateIso: "2026-08-15" });
    expect(result.fixtures).toHaveLength(0);
    expect(result.freshness).toBe("unavailable");
    expect(result.totalCount).toBe(0);
  });

  it("normalizes view rows into PublicFixtureDisplay structure", async () => {
    const mockRow = {
      id: "fix-123",
      kickoff_at: "2026-08-15T15:00:00Z",
      status: "live",
      status_detail: "1H",
      home_score: 1,
      away_score: 0,
      halftime_home_score: null,
      halftime_away_score: null,
      matchday: 1,
      round: "Regular Season - 1",
      stage: "Regular Season",
      last_synced_at: "2026-08-15T15:10:00Z",
      competition_id: "comp-1",
      competition_name: "Premier League",
      competition_key: "api-football-39",
      competition_logo_url: "https://example.com/epl.png",
      home_team_id: "team-1",
      home_team_name: "Arsenal",
      home_team_short_name: "ARS",
      home_team_logo_url: "https://example.com/ars.png",
      away_team_id: "team-2",
      away_team_name: "Chelsea",
      away_team_short_name: "CHE",
      away_team_logo_url: "https://example.com/che.png",
      venue_name: "Emirates Stadium",
      venue_city: "London",
    };

    mocks.createSupabaseServerClient.mockResolvedValueOnce({
      from: () => ({
        select: () => ({
          gte: () => ({
            lte: () => ({
              order: () => Promise.resolve({ data: [mockRow], error: null }),
            }),
          }),
        }),
      }),
    });

    const result = await getTodaysGames({ userTimezone: "UTC", dateIso: "2026-08-15" });
    expect(result.fixtures).toHaveLength(1);
    expect(result.fixtures[0]?.id).toBe("fix-123");
    expect(result.fixtures[0]?.status).toBe("live");
    expect(result.fixtures[0]?.homeTeam.name).toBe("Arsenal");
    expect(result.fixtures[0]?.awayTeam.name).toBe("Chelsea");
    expect(result.fixtures[0]?.homeScore).toBe(1);
    expect(result.fixtures[0]?.awayScore).toBe(0);
    expect(result.totalCount).toBe(1);
  });
});
