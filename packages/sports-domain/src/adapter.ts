import type { RawFixtureDto } from "./normalization";
import type { SportsProviderHttpClient } from "./http-client";

export interface ProviderCapability {
  fixtures: boolean;
  liveScores: boolean;
  standings: boolean;
  lineups: boolean;
  odds: boolean;
}

export interface SportsProviderAdapter {
  readonly providerName: string;
  readonly capabilities: ProviderCapability;

  getCompetitions(): Promise<{ id: string; name: string; type: "league" | "cup" }[]>;
  getFixtures(params?: {
    competitionId?: string;
    date?: string;
  }): Promise<RawFixtureDto[]>;
  getLiveFixtures(): Promise<RawFixtureDto[]>;
  healthCheck(): Promise<boolean>;
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
      const res = await this.client.get<{ response: unknown[] }>("/status");
      return Array.isArray(res.data.response);
    } catch {
      return false;
    }
  }

  public async getCompetitions(): Promise<
    { id: string; name: string; type: "league" | "cup" }[]
  > {
    const res = await this.client.get<{
      response: {
        league: { id: number; name: string; type: string };
      }[];
    }>("/leagues");

    return res.data.response.map((item) => ({
      id: String(item.league.id),
      name: item.league.name,
      type: item.league.type.toLowerCase() === "cup" ? "cup" : "league",
    }));
  }

  public async getFixtures(params?: {
    competitionId?: string;
    date?: string;
  }): Promise<RawFixtureDto[]> {
    const query: Record<string, string> = {};
    if (params?.competitionId) {
      query.league = params.competitionId;
    }
    if (params?.date) {
      query.date = params.date;
    }

    const res = await this.client.get<{
      response: {
        fixture: { id: number; date: string; status: { short: string } };
        league: { id: number; name: string };
        teams: {
          home: { id: number; name: string };
          away: { id: number; name: string };
        };
        goals: { home: number | null; away: number | null };
        score: { halftime: { home: number | null; away: number | null } };
      }[];
    }>("/fixtures", query);

    return res.data.response.map((item) => ({
      fixtureId: String(item.fixture.id),
      competitionId: String(item.league.id),
      competitionName: item.league.name,
      homeTeamId: String(item.teams.home.id),
      homeTeamName: item.teams.home.name,
      awayTeamId: String(item.teams.away.id),
      awayTeamName: item.teams.away.name,
      kickoffIso: item.fixture.date,
      statusRaw: item.fixture.status.short,
      homeScore: item.goals.home,
      awayScore: item.goals.away,
      halftimeHomeScore: item.score?.halftime?.home ?? null,
      halftimeAwayScore: item.score?.halftime?.away ?? null,
    }));
  }

  public async getLiveFixtures(): Promise<RawFixtureDto[]> {
    return this.getFixtures({ date: "live" });
  }
}
