export type CanonicalFixtureStatus =
  | "scheduled"
  | "delayed"
  | "postponed"
  | "cancelled"
  | "suspended"
  | "live"
  | "halftime"
  | "extra_time"
  | "penalties"
  | "finished"
  | "abandoned"
  | "awarded"
  | "unknown";

export interface CanonicalSport {
  id: string;
  key: string;
  name: string;
  active: boolean;
}

export interface CanonicalArea {
  id: string;
  key: string;
  name: string;
  code?: string | undefined;
  flagUrl?: string | undefined;
}

export interface CanonicalCompetition {
  id: string;
  sportId: string;
  areaId?: string | undefined;
  canonicalKey: string;
  name: string;
  shortName?: string | undefined;
  type: "league" | "cup";
  logoUrl?: string | undefined;
  active: boolean;
}

export interface CanonicalSeason {
  id: string;
  competitionId: string;
  name: string;
  startDate?: string | undefined;
  endDate?: string | undefined;
  current: boolean;
}

export interface CanonicalTeam {
  id: string;
  sportId: string;
  areaId?: string | undefined;
  canonicalName: string;
  shortName?: string | undefined;
  code?: string | undefined;
  logoUrl?: string | undefined;
  active: boolean;
}

export interface CanonicalVenue {
  id: string;
  name: string;
  city?: string | undefined;
  country?: string | undefined;
  capacity?: number | undefined;
}

export interface CanonicalFixture {
  id: string;
  sportId: string;
  competitionId: string;
  seasonId?: string | undefined;
  homeTeamId: string;
  awayTeamId: string;
  venueId?: string | undefined;
  kickoffAt: string; // ISO timestamptz UTC
  status: CanonicalFixtureStatus;
  statusDetail?: string | undefined;
  matchday?: number | undefined;
  round?: string | undefined;
  stage?: string | undefined;
  homeScore?: number | undefined;
  awayScore?: number | undefined;
  halftimeHomeScore?: number | undefined;
  halftimeAwayScore?: number | undefined;
  startedAt?: string | undefined;
  endedAt?: string | undefined;
  sourceUpdatedAt?: string | undefined;
  lastSyncedAt: string;
}

export interface ProviderEntityMapping {
  id?: string | undefined;
  provider: string;
  entityType:
    "sport" | "area" | "competition" | "season" | "team" | "venue" | "fixture";
  providerEntityId: string;
  canonicalEntityId: string;
  sourceLastSeenAt: string;
}

export interface IngestionRunResult {
  runId: string;
  provider: string;
  jobType: string;
  status: "completed" | "failed" | "running";
  fetchedCount: number;
  createdCount: number;
  updatedCount: number;
  failedCount: number;
  errorSummary?: string | undefined;
}
