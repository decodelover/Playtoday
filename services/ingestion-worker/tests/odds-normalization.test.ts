import { describe, expect, it, vi } from "vitest";
import {
  ApiFootballOddsAdapter,
  calculateMarketOverround,
  calculateRawImpliedProbability,
  normalizeSelection,
  parseDecimalOdds,
} from "@playtoday/bookmaker-adapters";
import { SportsProviderHttpClient } from "@playtoday/sports-domain";
import { deriveOddsMarketStatus } from "../src/odds-runner";

describe("odds normalization", () => {
  it("closes finished fixtures and makes postponed fixtures unavailable", () => {
    expect(deriveOddsMarketStatus("scheduled")).toBe("active");
    expect(deriveOddsMarketStatus("live")).toBe("active");
    expect(deriveOddsMarketStatus("postponed")).toBe("unavailable");
    expect(deriveOddsMarketStatus("suspended")).toBe("unavailable");
    expect(deriveOddsMarketStatus("finished")).toBe("closed");
    expect(deriveOddsMarketStatus("cancelled")).toBe("closed");
  });
  it("accepts bounded decimal odds and rejects invalid prices", () => {
    expect(parseDecimalOdds("2.15")).toBe(2.15);
    expect(parseDecimalOdds("1.00")).toBeNull();
    expect(parseDecimalOdds("0")).toBeNull();
    expect(parseDecimalOdds("NaN")).toBeNull();
    expect(parseDecimalOdds("1001")).toBeNull();
  });

  it("calculates raw implied probability and complete-market overround", () => {
    expect(calculateRawImpliedProbability(2)).toBe(0.5);
    expect(calculateRawImpliedProbability(1)).toBeNull();
    expect(calculateMarketOverround([2, 3.5, 4])).toBeCloseTo(0.035714, 5);
    expect(calculateMarketOverround([2])).toBeNull();
    expect(calculateMarketOverround([2, 1])).toBeNull();
  });

  it("normalizes mapped and parameterized selections", () => {
    expect(normalizeSelection("1", "Home", "home")).toEqual({
      selectionKey: "home",
      line: null,
      participant: null,
    });
    expect(normalizeSelection("5", "Over 2.5")).toEqual({
      selectionKey: "over",
      line: 2.5,
      participant: null,
    });
    expect(normalizeSelection("16", "Under 1.5", undefined, "home")).toEqual({
      selectionKey: "under",
      line: 1.5,
      participant: "home",
    });
    expect(normalizeSelection("4", "Away +0.5")).toEqual({
      selectionKey: "away",
      line: 0.5,
      participant: "away",
    });
  });

  it("rejects unsupported selection shapes rather than guessing", () => {
    expect(normalizeSelection("5", "Any total")).toBeNull();
    expect(normalizeSelection("999", "Home")).toBeNull();
  });
});

describe("API-Football odds adapter", () => {
  it("validates and maps a pre-match odds page", async () => {
    const client = new SportsProviderHttpClient({
      baseUrl: "https://v3.football.api-sports.io",
      apiKey: "test-key",
    });
    vi.spyOn(client, "get").mockResolvedValueOnce({
      data: {
        errors: [],
        paging: { current: 1, total: 2 },
        response: [
          {
            fixture: { id: 1493072, date: "2026-08-14T16:00:00Z" },
            update: "2026-08-14T08:02:18Z",
            bookmakers: [
              {
                id: 1,
                name: "10Bet",
                bets: [
                  {
                    id: 1,
                    name: "Match Winner",
                    values: [{ value: "Home", odd: "1.68" }],
                  },
                ],
              },
            ],
          },
        ],
      },
      status: 200,
      headers: new Headers({ "x-ratelimit-requests-remaining": "82" }),
    });

    const page = await new ApiFootballOddsAdapter(client).getPreMatchOdds({
      date: "2026-08-14",
      page: 1,
    });
    expect(page).toMatchObject({
      currentPage: 1,
      totalPages: 2,
      requestsRemaining: 82,
    });
    expect(page.events[0]?.providerEventId).toBe("1493072");
    expect(page.events[0]?.bookmakers[0]?.markets[0]?.values[0]).toEqual({
      selection: "Home",
      decimalOdds: "1.68",
    });
  });

  it("requires a bounded query scope", async () => {
    const client = new SportsProviderHttpClient({
      baseUrl: "https://v3.football.api-sports.io",
      apiKey: "test-key",
    });
    await expect(
      new ApiFootballOddsAdapter(client).getPreMatchOdds({}),
    ).rejects.toThrow("date or fixture ID");
  });
});
