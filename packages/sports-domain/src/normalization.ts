import { z } from "zod";
import type { CanonicalFixtureStatus } from "./types";

export const rawFixtureDtoSchema = z.object({
  fixtureId: z.union([z.string(), z.number()]),
  competitionId: z.union([z.string(), z.number()]),
  competitionName: z.string().min(1),
  homeTeamId: z.union([z.string(), z.number()]),
  homeTeamName: z.string().min(1),
  awayTeamId: z.union([z.string(), z.number()]),
  awayTeamName: z.string().min(1),
  kickoffIso: z.string().datetime({ offset: true }).or(z.string().min(10)),
  statusRaw: z.string(),
  homeScore: z.number().nullable().optional(),
  awayScore: z.number().nullable().optional(),
  halftimeHomeScore: z.number().nullable().optional(),
  halftimeAwayScore: z.number().nullable().optional(),
});

export type RawFixtureDto = z.infer<typeof rawFixtureDtoSchema>;

export function normalizeFixtureStatus(statusRaw: string): CanonicalFixtureStatus {
  const lower = statusRaw.toLowerCase().trim();

  switch (lower) {
    case "ns":
    case "not started":
    case "scheduled":
    case "tbd":
      return "scheduled";

    case "1h":
    case "2h":
    case "in_play":
    case "in play":
    case "live":
      return "live";

    case "ht":
    case "halftime":
    case "half-time":
      return "halftime";

    case "et":
    case "extra_time":
    case "extra time":
      return "extra_time";

    case "p":
    case "penalties":
    case "penalty":
      return "penalties";

    case "ft":
    case "aet":
    case "pen":
    case "match finished":
    case "finished":
      return "finished";

    case "pst":
    case "postponed":
      return "postponed";

    case "canc":
    case "cancelled":
    case "canceled":
      return "cancelled";

    case "susp":
    case "suspended":
      return "suspended";

    case "abd":
    case "abandoned":
      return "abandoned";

    case "awd":
    case "awarded":
      return "awarded";

    default:
      return "unknown";
  }
}

export function normalizeUtcTimestamp(rawTime: string): string {
  const date = new Date(rawTime);
  if (isNaN(date.getTime())) {
    throw new Error(
      `Invalid timestamp for canonical fixture normalization: ${rawTime}`,
    );
  }
  return date.toISOString();
}
