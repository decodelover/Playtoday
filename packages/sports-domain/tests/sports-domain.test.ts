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
    expect(normalizeFixtureStatus("DEL")).toBe("delayed");
    expect(normalizeFixtureStatus("delayed")).toBe("delayed");
    expect(normalizeFixtureStatus("1H")).toBe("live");
    expect(normalizeFixtureStatus("2H")).toBe("live");
    expect(normalizeFixtureStatus("HT")).toBe("halftime");
    expect(normalizeFixtureStatus("ET")).toBe("extra_time");
    expect(normalizeFixtureStatus("P")).toBe("penalties");
    expect(normalizeFixtureStatus("FT")).toBe("finished");
    expect(normalizeFixtureStatus("PST")).toBe("postponed");
    expect(normalizeFixtureStatus("CANC")).toBe("cancelled");
    expect(normalizeFixtureStatus("SUSP")).toBe("suspended");
    expect(normalizeFixtureStatus("ABD")).toBe("abandoned");
    expect(normalizeFixtureStatus("AWD")).toBe("awarded");
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
    expect(parsed.homeScore).toBeNull();
  });

  it("preserves distinction between null score (unplayed) and 0 score (zero goals)", () => {
    const unplayedDto = rawFixtureDtoSchema.parse({
      fixtureId: "1",
      competitionId: "39",
      competitionName: "Premier League",
      homeTeamId: "10",
      homeTeamName: "Arsenal",
      awayTeamId: "20",
      awayTeamName: "Chelsea",
      kickoffIso: "2026-08-15T15:00:00Z",
      statusRaw: "NS",
      homeScore: null,
      awayScore: null,
    });

    const finishedZeroZero = rawFixtureDtoSchema.parse({
      fixtureId: "2",
      competitionId: "39",
      competitionName: "Premier League",
      homeTeamId: "10",
      homeTeamName: "Arsenal",
      awayTeamId: "20",
      awayTeamName: "Chelsea",
      kickoffIso: "2026-08-15T15:00:00Z",
      statusRaw: "FT",
      homeScore: 0,
      awayScore: 0,
    });

    expect(unplayedDto.homeScore).toBeNull();
    expect(finishedZeroZero.homeScore).toBe(0);
    expect(finishedZeroZero.awayScore).toBe(0);
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
        errors: [],
        results: 2,
        paging: { current: 1, total: 1 },
        response: [
          {
            league: {
              id: 39,
              name: "Premier League",
              type: "League",
              logo: "http://example.com/logo.png",
            },
            country: { name: "England", code: "GB" },
          },
          {
            league: { id: 45, name: "FA Cup", type: "Cup" },
            country: { name: "England" },
          },
        ],
      },
      status: 200,
      headers: new Headers(),
    });

    const adapter = new ApiFootballAdapter(httpClient);
    const comps = await adapter.getCompetitions();

    expect(comps).toHaveLength(2);
    expect(comps[0]?.id).toBe("39");
    expect(comps[0]?.name).toBe("Premier League");
    expect(comps[0]?.type).toBe("league");
    expect(comps[0]?.country).toBe("England");
    expect(comps[1]?.type).toBe("cup");
  });

  it("fetches teams via ApiFootballAdapter", async () => {
    const httpClient = new SportsProviderHttpClient({
      baseUrl: "https://v3.football.api-sports.io",
      apiKey: "test-key",
    });

    vi.spyOn(httpClient, "get").mockResolvedValueOnce({
      data: {
        errors: [],
        results: 1,
        paging: { current: 1, total: 1 },
        response: [
          {
            team: {
              id: 33,
              name: "Manchester United",
              code: "MUN",
              country: "England",
              logo: "http://example.com/mun.png",
            },
            venue: { name: "Old Trafford", city: "Manchester" },
          },
        ],
      },
      status: 200,
      headers: new Headers(),
    });

    const adapter = new ApiFootballAdapter(httpClient);
    const teams = await adapter.getTeams("39", 2026);

    expect(teams).toHaveLength(1);
    expect(teams[0]?.id).toBe("33");
    expect(teams[0]?.name).toBe("Manchester United");
    expect(teams[0]?.venueName).toBe("Old Trafford");
  });

  it("fetches fixtures cleanly via ApiFootballAdapter with query params", async () => {
    const httpClient = new SportsProviderHttpClient({
      baseUrl: "https://v3.football.api-sports.io",
      apiKey: "test-key",
    });

    vi.spyOn(httpClient, "get").mockResolvedValueOnce({
      data: {
        errors: [],
        results: 1,
        paging: { current: 1, total: 1 },
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
    const fixtures = await adapter.getFixtures({
      competitionId: "39",
      seasonYear: 2026,
    });

    expect(fixtures).toHaveLength(1);
    expect(fixtures[0]?.fixtureId).toBe("867946");
    expect(fixtures[0]?.homeTeamName).toBe("Man Utd");
    expect(fixtures[0]?.statusRaw).toBe("NS");
  });

  it("validates the real provider status shape and quota", async () => {
    const httpClient = new SportsProviderHttpClient({
      baseUrl: "https://v3.football.api-sports.io",
      apiKey: "test-key",
    });
    vi.spyOn(httpClient, "get").mockResolvedValueOnce({
      data: {
        errors: [],
        results: 1,
        paging: { current: 1, total: 1 },
        response: {
          subscription: { plan: "Free", active: true },
          requests: { current: 3, limit_day: 100 },
        },
      },
      status: 200,
      headers: new Headers(),
    });
    const status = await new ApiFootballAdapter(httpClient).getHealthStatus();
    expect(status).toMatchObject({
      healthy: true,
      requestsUsed: 3,
      requestsLimit: 100,
      requestsRemaining: 97,
    });
  });

  it("rejects malformed provider fixture envelopes", async () => {
    const httpClient = new SportsProviderHttpClient({
      baseUrl: "https://v3.football.api-sports.io",
      apiKey: "test-key",
    });
    vi.spyOn(httpClient, "get").mockResolvedValueOnce({
      data: { response: "not-an-array" },
      status: 200,
      headers: new Headers(),
    });
    await expect(new ApiFootballAdapter(httpClient).getFixtures()).rejects.toThrow();
  });

  it("does not retry provider authentication failures", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("Unauthorized", { status: 401 }));
    const client = new SportsProviderHttpClient({
      baseUrl: "https://v3.football.api-sports.io",
      apiKey: "invalid-test-key",
      maxRetries: 3,
    });
    await expect(client.get("/status")).rejects.toThrow("401");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    fetchMock.mockRestore();
  });

  it("retries a quota response and succeeds", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response("Quota", { status: 429 }))
      .mockResolvedValueOnce(Response.json({ response: [] }, { status: 200 }));
    const client = new SportsProviderHttpClient({
      baseUrl: "https://v3.football.api-sports.io",
      apiKey: "test-key",
      maxRetries: 2,
    });
    await expect(client.get("/status")).resolves.toMatchObject({ status: 200 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    fetchMock.mockRestore();
  });
});
