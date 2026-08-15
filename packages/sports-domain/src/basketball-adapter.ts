import type { RawFixtureDto } from "./normalization.js";
import type { SportsProviderHttpClient } from "./http-client.js";
import { z } from "zod";

const basketballEnvelopeSchema = z.object({
  errors: z.union([z.array(z.unknown()), z.record(z.string(), z.unknown())]),
  results: z.number().int().nonnegative(),
  paging: z.object({ current: z.number().int(), total: z.number().int() }),
  response: z.unknown(),
});

const basketballGamesSchema = basketballEnvelopeSchema.extend({
  response: z.array(
    z.object({
      id: z.number(),
      date: z.string().min(10),
      time: z.string().optional(),
      status: z.object({
        short: z.string(),
        long: z.string().optional(),
      }),
      league: z.object({
        id: z.number(),
        name: z.string().min(1),
        type: z.string().optional(),
        season: z.union([z.string(), z.number()]).optional(),
        logo: z.string().url().optional(),
      }),
      country: z.object({
        name: z.string().optional(),
        code: z.string().nullable().optional(),
        flag: z.string().url().nullable().optional(),
      }),
      teams: z.object({
        home: z.object({
          id: z.number(),
          name: z.string().min(1),
          logo: z.string().url().optional(),
        }),
        away: z.object({
          id: z.number(),
          name: z.string().min(1),
          logo: z.string().url().optional(),
        }),
      }),
      scores: z
        .object({
          home: z
            .object({
              total: z.number().nullable().optional(),
            })
            .optional(),
          away: z
            .object({
              total: z.number().nullable().optional(),
            })
            .optional(),
        })
        .optional(),
    }),
  ),
});

export class ApiBasketballAdapter {
  public readonly providerName = "api-basketball";

  constructor(private readonly client: SportsProviderHttpClient) {}

  public async getGames(params?: { date?: string; league?: string; season?: string }): Promise<RawFixtureDto[]> {
    const query: Record<string, string> = {};
    if (params?.date) query.date = params.date;
    if (params?.league) query.league = params.league;
    if (params?.season) query.season = params.season;

    const res = await this.client.get<unknown>("/games", query);
    return this.parseGames(res.data);
  }

  public async getLiveGames(): Promise<RawFixtureDto[]> {
    const res = await this.client.get<unknown>("/games", { live: "all" });
    return this.parseGames(res.data);
  }

  private parseGames(data: unknown): RawFixtureDto[] {
    const payload = basketballGamesSchema.parse(data);
    const errorCount = Array.isArray(payload.errors)
      ? payload.errors.length
      : Object.keys(payload.errors).length;
    if (errorCount > 0) {
      throw new Error("API-Basketball returned error payload");
    }

    return payload.response.map((item) => {
      let seasonYear: number | undefined;
      if (typeof item.league.season === "number") {
        seasonYear = item.league.season;
      } else if (typeof item.league.season === "string") {
        const parsed = parseInt(item.league.season.slice(0, 4), 10);
        if (!isNaN(parsed)) seasonYear = parsed;
      }

      return {
        fixtureId: `bb_${item.id}`,
        competitionId: `bb_${item.league.id}`,
        competitionName: item.league.name,
        competitionType: item.league.type?.toLowerCase() === "cup" ? "cup" : "league",
        competitionLogoUrl: item.league.logo ?? undefined,
        countryName: item.country?.name ?? undefined,
        countryFlagUrl: item.country?.flag ?? undefined,
        seasonYear,
        round: "Regular Season",
        homeTeamId: `bb_${item.teams.home.id}`,
        homeTeamName: item.teams.home.name,
        homeTeamLogoUrl: item.teams.home.logo ?? undefined,
        awayTeamId: `bb_${item.teams.away.id}`,
        awayTeamName: item.teams.away.name,
        awayTeamLogoUrl: item.teams.away.logo ?? undefined,
        kickoffIso: item.date,
        statusRaw: item.status.short,
        homeScore: item.scores?.home?.total ?? null,
        awayScore: item.scores?.away?.total ?? null,
        halftimeHomeScore: null,
        halftimeAwayScore: null,
      };
    });
  }
}
