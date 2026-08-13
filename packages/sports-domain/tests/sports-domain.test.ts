import { describe, expect, it, vi } from "vitest";
import {
  ApiFootballAdapter,
  SportsProviderHttpClient,
  normalizeFixtureStatus,
  normalizeUtcTimestamp,
  rawFixtureDtoSchema,
} from "../src";

describe("Sports Domain - Normalization Layer", () => {
  it("normalizes raw provider statuses to canonical fixture statuses", () => {
    expect(normalizeFixtureStatus("NS")).toBe("scheduled");
    expect(normalizeFixtureStatus("1H")).toBe("live");
    expect(normalizeFixtureStatus("HT")).toBe("halftime");
    expect(normalizeFixtureStatus("FT")).toBe("finished");
    expect(normalizeFixtureStatus("PST")).toBe("postponed");
    expect(normalizeFixtureStatus("CANC")).toBe("cancelled");
    expect(normalizeFixtureStatus("UNKNOWN_CODE")).toBe("unknown");
  });

  it("normalizes valid dates to ISO UTC strings", () => {
    const iso = normalizeUtcTimestamp("2026-08-15T15:00:00Z");
    expect(iso).toBe("2026-08-15T15:00:00.000Z");
  });

  it("validates valid DTO payloads with Zod", () => {
    const dto = {
      fixtureId: 1001,
      competitionId: 39,
      competitionName: "Premier League",
      homeTeamId: 33,
      homeTeamName: "Manchester United",
      awayTeamId: 40,
      awayTeamName: "Liverpool",
      kickoffIso: "2026-08-15T15:00:00Z",
      statusRaw: "NS",
      homeScore: null,
      awayScore: null,
    };

    const parsed = rawFixtureDtoSchema.parse(dto);
    expect(parsed.fixtureId).toBe(1001);
    expect(parsed.homeTeamName).toBe("Manchester United");
  });
});

describe("Sports Domain - Adapter Layer", () => {
  it("fetches competitions cleanly via ApiFootballAdapter", async () => {
    const httpClient = new SportsProviderHttpClient({
      baseUrl: "https://v3.football.api-sports.io",
      apiKey: "test-key",
    });

    vi.spyOn(httpClient, "get").mockResolvedValueOnce({
      data: {
        response: [
          { league: { id: 39, name: "Premier League", type: "League" } },
          { league: { id: 45, name: "FA Cup", type: "Cup" } },
        ],
      },
      status: 200,
      headers: new Headers(),
    });

    const adapter = new ApiFootballAdapter(httpClient);
    const comps = await adapter.getCompetitions();

    expect(comps).toHaveLength(2);
    expect(comps[0]).toEqual({ id: "39", name: "Premier League", type: "league" });
    expect(comps[1]).toEqual({ id: "45", name: "FA Cup", type: "cup" });
  });

  it("fetches fixtures cleanly via ApiFootballAdapter", async () => {
    const httpClient = new SportsProviderHttpClient({
      baseUrl: "https://v3.football.api-sports.io",
      apiKey: "test-key",
    });

    vi.spyOn(httpClient, "get").mockResolvedValueOnce({
      data: {
        response: [
          {
            fixture: {
              id: 867946,
              date: "2026-08-15T15:00:00+00:00",
              status: { short: "NS" },
            },
            league: { id: 39, name: "Premier League" },
            teams: {
              home: { id: 33, name: "Man Utd" },
              away: { id: 40, name: "Liverpool" },
            },
            goals: { home: null, away: null },
            score: { halftime: { home: null, away: null } },
          },
        ],
      },
      status: 200,
      headers: new Headers(),
    });

    const adapter = new ApiFootballAdapter(httpClient);
    const fixtures = await adapter.getFixtures({ competitionId: "39" });

    expect(fixtures).toHaveLength(1);
    expect(fixtures[0]?.fixtureId).toBe("867946");
    expect(fixtures[0]?.homeTeamName).toBe("Man Utd");
    expect(fixtures[0]?.statusRaw).toBe("NS");
  });
});
