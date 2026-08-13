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
  code?: string;
  flagUrl?: string;
}

export interface CanonicalCompetition {
  id: string;
  sportId: string;
  areaId?: string;
  canonicalKey: string;
  name: string;
  shortName?: string;
  type: "league" | "cup";
  logoUrl?: string;
  active: boolean;
}

export interface CanonicalSeason {
  id: string;
  competitionId: string;
  name: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
}

export interface CanonicalTeam {
  id: string;
  sportId: string;
  areaId?: string;
  canonicalName: string;
  shortName?: string;
  code?: string;
  logoUrl?: string;
  active: boolean;
}

export interface CanonicalVenue {
  id: string;
  name: string;
  city?: string;
  country?: string;
  capacity?: number;
}

export interface CanonicalFixture {
  id: string;
  sportId: string;
  competitionId: string;
  seasonId?: string;
  homeTeamId: string;
  awayTeamId: string;
  venueId?: string;
  kickoffAt: string; // ISO timestamptz UTC
  status: CanonicalFixtureStatus;
  statusDetail?: string;
  matchday?: number;
  round?: string;
  stage?: string;
  homeScore?: number;
  awayScore?: number;
  halftimeHomeScore?: number;
  halftimeAwayScore?: number;
  startedAt?: string;
  endedAt?: string;
  sourceUpdatedAt?: string;
  lastSyncedAt: string;
}

export interface ProviderEntityMapping {
  id?: string;
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
  errorSummary?: string;
}
