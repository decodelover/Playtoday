import type { RawFixtureDto } from "./normalization.js";
import type { SportsProviderHttpClient } from "./http-client.js";
import { z } from "zod";

export interface ProviderCapability {
  fixtures: boolean;
  liveScores: boolean;
  standings: boolean;
  lineups: boolean;
  odds: boolean;
}

export interface CompetitionDto {
  id: string;
  name: string;
  type: "league" | "cup";
  country?: string | undefined;
  countryCode?: string | undefined;
  logoUrl?: string | undefined;
}

export interface TeamDto {
  id: string;
  name: string;
  shortName?: string | undefined;
  code?: string | undefined;
  logoUrl?: string | undefined;
  country?: string | undefined;
  venueName?: string | undefined;
  venueCity?: string | undefined;
}

export interface FixtureQueryParams {
  fixtureId?: string | undefined;
  competitionId?: string | undefined;
  date?: string | undefined;
  seasonYear?: number | undefined;
  fromDate?: string | undefined;
  toDate?: string | undefined;
}

export interface SportsProviderAdapter {
  readonly providerName: string;
  readonly capabilities: ProviderCapability;

  getCompetitions(): Promise<CompetitionDto[]>;
  getTeams(competitionId: string, seasonYear?: number): Promise<TeamDto[]>;
  getFixtures(params?: FixtureQueryParams): Promise<RawFixtureDto[]>;
  getLiveFixtures(): Promise<RawFixtureDto[]>;
  healthCheck(): Promise<boolean>;
}

const providerEnvelopeSchema = z.object({
  errors: z.union([z.array(z.unknown()), z.record(z.string(), z.unknown())]),
  results: z.number().int().nonnegative(),
  paging: z.object({ current: z.number().int(), total: z.number().int() }),
  response: z.unknown(),
});

const providerStatusSchema = providerEnvelopeSchema.extend({
  response: z.object({
    subscription: z.object({ plan: z.string(), active: z.boolean() }),
    requests: z.object({ current: z.number().int(), limit_day: z.number().int() }),
  }),
});

const competitionResponseSchema = providerEnvelopeSchema.extend({
  response: z.array(
    z.object({
      league: z.object({
        id: z.number(),
        name: z.string().min(1),
        type: z.string(),
        logo: z.string().url().optional(),
      }),
      country: z.object({
        name: z.string().optional(),
        code: z.string().nullable().optional(),
      }),
    }),
  ),
});

const teamResponseSchema = providerEnvelopeSchema.extend({
  response: z.array(
    z.object({
      team: z.object({
        id: z.number(),
        name: z.string().min(1),
        code: z.string().nullable().optional(),
        country: z.string().optional(),
        logo: z.string().url().optional(),
      }),
      venue: z
        .object({
          name: z.string().nullable().optional(),
          city: z.string().nullable().optional(),
        })
        .optional(),
    }),
  ),
});

const fixtureResponseSchema = providerEnvelopeSchema.extend({
  response: z.array(
    z.object({
      fixture: z.object({
        id: z.number(),
        date: z.string().min(10),
        status: z.object({ short: z.string() }),
        venue: z
          .object({
            id: z.number().nullable().optional(),
            name: z.string().nullable().optional(),
            city: z.string().nullable().optional(),
          })
          .optional(),
      }),
      league: z.object({
        id: z.number(),
        name: z.string().min(1),
        type: z.string().optional(),
        logo: z.string().url().optional(),
        country: z.string().optional(),
        flag: z.string().url().nullable().optional(),
        season: z.number().int().optional(),
        round: z.string().nullable().optional(),
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
      goals: z.object({ home: z.number().nullable(), away: z.number().nullable() }),
      score: z.object({
        halftime: z.object({
          home: z.number().nullable(),
          away: z.number().nullable(),
        }),
      }),
    }),
  ),
});

export interface ProviderHealthStatus {
  healthy: boolean;
  plan: string;
  subscriptionActive: boolean;
  requestsUsed: number;
  requestsLimit: number;
  requestsRemaining: number;
}

export class ApiFootballAdapter implements SportsProviderAdapter {
  public readonly providerName = "api-football";
  public readonly capabilities: ProviderCapability = {
    fixtures: true,
    liveScores: true,
    standings: true,
    lineups: true,
    odds: true,
  };

  constructor(private readonly client: SportsProviderHttpClient) {}

  public async healthCheck(): Promise<boolean> {
    try {
      return (await this.getHealthStatus()).healthy;
    } catch {
      return false;
    }
  }

  public async getHealthStatus(): Promise<ProviderHealthStatus> {
    const res = await this.client.get<unknown>("/status");
    const payload = providerStatusSchema.parse(res.data);
    const errorCount = Array.isArray(payload.errors)
      ? payload.errors.length
      : Object.keys(payload.errors).length;
    return {
      healthy: errorCount === 0 && payload.response.subscription.active,
      plan: payload.response.subscription.plan,
      subscriptionActive: payload.response.subscription.active,
      requestsUsed: payload.response.requests.current,
      requestsLimit: payload.response.requests.limit_day,
      requestsRemaining: Math.max(
        0,
        payload.response.requests.limit_day - payload.response.requests.current,
      ),
    };
  }

  public async getCompetitions(): Promise<CompetitionDto[]> {
    const res = await this.client.get<unknown>("/leagues");
    const payload = competitionResponseSchema.parse(res.data);
    this.assertProviderSuccess(payload.errors, "competitions");

    return payload.response.map((item) => ({
      id: String(item.league.id),
      name: item.league.name,
      type: item.league.type?.toLowerCase() === "cup" ? "cup" : "league",
      country: item.country?.name,
      countryCode: item.country?.code ?? undefined,
      logoUrl: item.league.logo ?? undefined,
    }));
  }

  public async getTeams(
    competitionId: string,
    seasonYear: number = new Date().getFullYear(),
  ): Promise<TeamDto[]> {
    const res = await this.client.get<unknown>("/teams", {
      league: competitionId,
      season: String(seasonYear),
    });
    const payload = teamResponseSchema.parse(res.data);
    this.assertProviderSuccess(payload.errors, "teams");

    return payload.response.map((item) => ({
      id: String(item.team.id),
      name: item.team.name,
      code: item.team.code ?? undefined,
      country: item.team.country ?? undefined,
      logoUrl: item.team.logo ?? undefined,
      venueName: item.venue?.name ?? undefined,
      venueCity: item.venue?.city ?? undefined,
    }));
  }

  public async getFixtures(params?: FixtureQueryParams): Promise<RawFixtureDto[]> {
    const query: Record<string, string> = {};
    if (params?.fixtureId) {
      query.id = params.fixtureId;
    }
    if (params?.competitionId) {
      query.league = params.competitionId;
    }
    if (params?.seasonYear) {
      query.season = String(params.seasonYear);
    }
    if (params?.date) {
      query.date = params.date;
    }
    if (params?.fromDate) {
      query.from = params.fromDate;
    }
    if (params?.toDate) {
      query.to = params.toDate;
    }

    const res = await this.client.get<unknown>("/fixtures", query);
    return this.parseFixtures(res.data);
  }

  public async getLiveFixtures(): Promise<RawFixtureDto[]> {
    const res = await this.client.get<unknown>("/fixtures", { live: "all" });
    return this.parseFixtures(res.data);
  }

  public async getStandings(
    competitionId: string,
    seasonYear: number = new Date().getFullYear(),
  ): Promise<import("./intelligence.js").StandingsRowDto[]> {
    const res = await this.client.get<unknown>("/standings", {
      league: competitionId,
      season: String(seasonYear),
    });

    const envelope = providerEnvelopeSchema.parse(res.data);
    this.assertProviderSuccess(envelope.errors, "standings");

    const data = envelope.response as Array<{
      league: {
        standings: Array<
          Array<{
            rank: number;
            team: { id: number; name: string; logo?: string };
            points: number;
            goalsDiff: number;
            form?: string;
            all: {
              played: number;
              win: number;
              draw: number;
              lose: number;
              goals: { for: number; against: number };
            };
            home: {
              played: number;
              win: number;
              draw: number;
              lose: number;
              goals: { for: number; against: number };
            };
            away: {
              played: number;
              win: number;
              draw: number;
              lose: number;
              goals: { for: number; against: number };
            };
          }>
        >;
      };
    }>;

    const firstItem = data[0];
    if (!firstItem || !firstItem.league || !firstItem.league.standings) {
      return [];
    }

    const flatStandings = firstItem.league.standings.flat();
    return flatStandings.map((row) => ({
      rank: row.rank,
      teamId: String(row.team.id),
      teamName: row.team.name,
      teamLogo: row.team.logo ?? null,
      played: row.all.played,
      wins: row.all.win,
      draws: row.all.draw,
      losses: row.all.lose,
      goalsFor: row.all.goals.for,
      goalsAgainst: row.all.goals.against,
      goalDifference: row.goalsDiff,
      points: row.points,
      formString: row.form ?? null,
      homeStats: {
        played: row.home.played,
        wins: row.home.win,
        draws: row.home.draw,
        losses: row.home.lose,
        goalsFor: row.home.goals.for,
        goalsAgainst: row.home.goals.against,
      },
      awayStats: {
        played: row.away.played,
        wins: row.away.win,
        draws: row.away.draw,
        losses: row.away.lose,
        goalsFor: row.away.goals.for,
        goalsAgainst: row.away.goals.against,
      },
    }));
  }

  public async getFixtureStatistics(
    fixtureId: string,
  ): Promise<import("./intelligence.js").MatchStatisticsDto[]> {
    const res = await this.client.get<unknown>("/fixtures/statistics", {
      fixture: fixtureId,
    });

    const envelope = providerEnvelopeSchema.parse(res.data);
    this.assertProviderSuccess(envelope.errors, "fixture statistics");

    const data = envelope.response as Array<{
      team: { id: number; name: string };
      statistics: Array<{ type: string; value: number | string | null }>;
    }>;

    if (!data || data.length === 0) return [];

    return data.map((item, index) => {
      const statsMap = new Map<string, number | null>();
      item.statistics.forEach((s) => {
        if (s.value === null || s.value === undefined) {
          statsMap.set(s.type, null);
        } else if (typeof s.value === "string" && s.value.includes("%")) {
          statsMap.set(s.type, parseFloat(s.value.replace("%", "")));
        } else {
          statsMap.set(s.type, Number(s.value));
        }
      });

      return {
        teamId: String(item.team.id),
        teamName: item.team.name,
        side: index === 0 ? "home" : "away",
        shotsOnGoal: statsMap.get("Shots on Goal") ?? null,
        shotsOffGoal: statsMap.get("Shots off Goal") ?? null,
        totalShots: statsMap.get("Total Shots") ?? null,
        blockedShots: statsMap.get("Blocked Shots") ?? null,
        shotsInsideBox: statsMap.get("Shots insidebox") ?? null,
        shotsOutsideBox: statsMap.get("Shots outsidebox") ?? null,
        fouls: statsMap.get("Fouls") ?? null,
        cornerKicks: statsMap.get("Corner Kicks") ?? null,
        offsides: statsMap.get("Offsides") ?? null,
        possessionPercentage: statsMap.get("Ball Possession") ?? null,
        yellowCards: statsMap.get("Yellow Cards") ?? null,
        redCards: statsMap.get("Red Cards") ?? null,
        goalkeeperSaves: statsMap.get("Goalkeeper Saves") ?? null,
        totalPasses: statsMap.get("Total passes") ?? null,
        passesAccurate: statsMap.get("Passes accurate") ?? null,
        passesPercentage: statsMap.get("Passes %") ?? null,
      };
    });
  }

  public async getFixtureLineups(
    fixtureId: string,
  ): Promise<import("./intelligence.js").MatchLineupDto[]> {
    const res = await this.client.get<unknown>("/fixtures/lineups", {
      fixture: fixtureId,
    });

    const envelope = providerEnvelopeSchema.parse(res.data);
    this.assertProviderSuccess(envelope.errors, "fixture lineups");

    const data = envelope.response as Array<{
      team: { id: number; name: string };
      formation: string | null;
      coach?: { name?: string | null };
      startXI?: Array<{ player: { id: number; name: string; number: number; pos: string; grid: string } }>;
      substitutes?: Array<{ player: { id: number; name: string; number: number; pos: string; grid: string } }>;
    }>;

    if (!data || data.length === 0) return [];

    return data.map((item, index) => ({
      teamId: String(item.team.id),
      teamName: item.team.name,
      side: index === 0 ? "home" : "away",
      formation: item.formation ?? null,
      coachName: item.coach?.name ?? null,
      startingXI: (item.startXI ?? []).map((p) => ({
        id: p.player.id,
        name: p.player.name,
        number: p.player.number ?? null,
        pos: p.player.pos ?? null,
        grid: p.player.grid ?? null,
      })),
      substitutes: (item.substitutes ?? []).map((p) => ({
        id: p.player.id,
        name: p.player.name,
        number: p.player.number ?? null,
        pos: p.player.pos ?? null,
        grid: p.player.grid ?? null,
      })),
    }));
  }

  public async getFixtureInjuries(
    fixtureId: string,
  ): Promise<import("./intelligence.js").MatchInjuryDto[]> {
    const res = await this.client.get<unknown>("/injuries", {
      fixture: fixtureId,
    });

    const envelope = providerEnvelopeSchema.parse(res.data);
    this.assertProviderSuccess(envelope.errors, "injuries");

    const data = envelope.response as Array<{
      player: { name: string; photo?: string | null; type?: string | null; reason?: string | null };
      team: { id: number; name: string };
    }>;

    if (!data || data.length === 0) return [];

    return data.map((item) => ({
      playerName: item.player.name,
      teamId: String(item.team.id),
      reason: item.player.reason ?? item.player.type ?? "Missing Fixture",
      absenceType: item.player.type ?? "Injury",
      photoUrl: item.player.photo ?? null,
    }));
  }

  public async getHeadToHead(team1Id: string, team2Id: string): Promise<RawFixtureDto[]> {
    const res = await this.client.get<unknown>("/fixtures/headtohead", {
      h2h: `${team1Id}-${team2Id}`,
    });
    return this.parseFixtures(res.data);
  }

  private parseFixtures(data: unknown): RawFixtureDto[] {
    const payload = fixtureResponseSchema.parse(data);
    this.assertProviderSuccess(payload.errors, "fixtures");

    return payload.response.map((item) => ({
      fixtureId: String(item.fixture.id),
      competitionId: String(item.league.id),
      competitionName: item.league.name,
      competitionType: item.league.type?.toLowerCase() === "cup" ? "cup" : "league",
      competitionLogoUrl: item.league.logo ?? undefined,
      countryName: item.league.country ?? undefined,
      countryFlagUrl: item.league.flag ?? undefined,
      seasonYear: item.league.season,
      round: item.league.round ?? undefined,
      homeTeamId: String(item.teams.home.id),
      homeTeamName: item.teams.home.name,
      homeTeamLogoUrl: item.teams.home.logo ?? undefined,
      awayTeamId: String(item.teams.away.id),
      awayTeamName: item.teams.away.name,
      awayTeamLogoUrl: item.teams.away.logo ?? undefined,
      venueProviderId: item.fixture.venue?.id ?? undefined,
      venueName: item.fixture.venue?.name ?? undefined,
      venueCity: item.fixture.venue?.city ?? undefined,
      kickoffIso: item.fixture.date,
      statusRaw: item.fixture.status.short,
      homeScore: item.goals.home,
      awayScore: item.goals.away,
      halftimeHomeScore: item.score?.halftime?.home ?? null,
      halftimeAwayScore: item.score?.halftime?.away ?? null,
    }));
  }

  private assertProviderSuccess(
    errors: unknown[] | Record<string, unknown>,
    resource: string,
  ): void {
    const errorCount = Array.isArray(errors)
      ? errors.length
      : Object.keys(errors).length;
    if (errorCount > 0) {
      throw new Error(`Provider returned an error payload for ${resource}`);
    }
  }
}

