import "server-only";

import type { Database } from "@playtoday/database-types";
import type { CanonicalFixtureStatus } from "@playtoday/sports-domain";
import { createSupabaseServerClient } from "./supabase/server";

export interface PublicFixtureDisplay {
  id: string;
  kickoffAt: string;
  status: CanonicalFixtureStatus;
  statusDetail: string | null;
  homeScore: number | null;
  awayScore: number | null;
  halftimeHomeScore: number | null;
  halftimeAwayScore: number | null;
  matchday: number | null;
  round: string | null;
  stage: string | null;
  lastSyncedAt: string;
  competition: {
    id: string;
    name: string;
    key: string;
    logoUrl: string | null;
  };
  homeTeam: {
    id: string;
    name: string;
    shortName: string | null;
    logoUrl: string | null;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName: string | null;
    logoUrl: string | null;
  };
  venue: {
    name: string | null;
    city: string | null;
  } | null;
}

export interface TodaysGamesResponse {
  fixtures: PublicFixtureDisplay[];
  dateIso: string;
  todayDateIso: string;
  userTimezone: string;
  freshness: "current" | "stale" | "delayed" | "unavailable";
  lastSyncedAt: string | null;
  totalCount: number;
}

type PublicFixtureViewRow = Database["public"]["Views"]["v_public_fixtures"]["Row"];

function toCanonicalStatus(status: unknown): CanonicalFixtureStatus {
  const str = typeof status === "string" ? status : "";
  if (
    str === "scheduled" ||
    str === "delayed" ||
    str === "live" ||
    str === "halftime" ||
    str === "extra_time" ||
    str === "penalties" ||
    str === "finished" ||
    str === "postponed" ||
    str === "cancelled" ||
    str === "suspended" ||
    str === "abandoned" ||
    str === "awarded"
  ) {
    return str;
  }
  return "scheduled";
}

/**
 * Computes UTC bounds for a local calendar day in the target IANA timezone.
 */
export function getUtcBoundsForTimezone(
  dateIso: string,
  userTimezone = "UTC",
): { startUtc: string; endUtc: string } {
  try {
    const parts = dateIso.split("-");
    const yearStr = parts[0];
    const monthStr = parts[1];
    const dayStr = parts[2];
    const year = Number.parseInt(yearStr ?? "", 10);
    const month = Number.parseInt(monthStr ?? "", 10) - 1;
    const day = Number.parseInt(dayStr ?? "", 10);

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      throw new Error("Invalid date components");
    }

    const getOffset = (instant: Date): number => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: userTimezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        hourCycle: "h23",
      });
      const values = Object.fromEntries(
        formatter
          .formatToParts(instant)
          .filter((part) => part.type !== "literal")
          .map((part) => [part.type, part.value]),
      );
      const representedUtc = Date.UTC(
        Number(values.year),
        Number(values.month) - 1,
        Number(values.day),
        Number(values.hour) % 24,
        Number(values.minute),
        Number(values.second),
      );
      return representedUtc - instant.getTime();
    };
    const toUtc = (utcWallTime: number): Date => {
      let candidate = new Date(utcWallTime - getOffset(new Date(utcWallTime)));
      candidate = new Date(utcWallTime - getOffset(candidate));
      return candidate;
    };
    const startWallTime = Date.UTC(year, month, day, 0, 0, 0, 0);
    const nextDayWallTime = Date.UTC(year, month, day + 1, 0, 0, 0, 0);
    const startUtc = toUtc(startWallTime);
    const endUtc = new Date(toUtc(nextDayWallTime).getTime() - 1);

    return {
      startUtc: startUtc.toISOString(),
      endUtc: endUtc.toISOString(),
    };
  } catch {
    const startUtc = new Date(`${dateIso}T00:00:00.000Z`).toISOString();
    const endUtc = new Date(`${dateIso}T23:59:59.999Z`).toISOString();
    return { startUtc, endUtc };
  }
}

export function getLocalDateIso(date: Date, userTimezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: userTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

/**
 * Queries Today's Games canonical read model `v_public_fixtures`.
 */
export async function getTodaysGames(options?: {
  userTimezone?: string;
  dateIso?: string;
  competitionId?: string;
  status?: string;
}): Promise<TodaysGamesResponse> {
  const userTimezone = options?.userTimezone ?? "UTC";
  const todayIso = getLocalDateIso(new Date(), userTimezone);
  const targetDateIso = options?.dateIso ?? todayIso;

  const { startUtc, endUtc } = getUtcBoundsForTimezone(targetDateIso, userTimezone);

  const supabase = await createSupabaseServerClient();

  const query = supabase
    .from("v_public_fixtures")
    .select("*")
    .gte("kickoff_at", startUtc)
    .lte("kickoff_at", endUtc)
    .order("kickoff_at", { ascending: true });

  if (options?.competitionId) {
    query.eq("competition_id", options.competitionId);
  }

  if (options?.status) {
    query.eq("status", options.status);
  }

  const { data, error } = await query;

  if (error || !data) {
    return {
      fixtures: [],
      dateIso: targetDateIso,
      todayDateIso: todayIso,
      userTimezone,
      freshness: "unavailable",
      lastSyncedAt: null,
      totalCount: 0,
    };
  }

  const rawData: unknown = data;
  const rows: PublicFixtureViewRow[] = Array.isArray(rawData)
    ? (rawData as PublicFixtureViewRow[])
    : [];

  const fixtures: PublicFixtureDisplay[] = rows.map((item) => {
    const statusVal: CanonicalFixtureStatus = toCanonicalStatus(item.status);
    return {
      id: item.id ?? "",
      kickoffAt: item.kickoff_at ?? "",
      status: statusVal,
      statusDetail: item.status_detail ?? null,
      homeScore: item.home_score ?? null,
      awayScore: item.away_score ?? null,
      halftimeHomeScore: item.halftime_home_score ?? null,
      halftimeAwayScore: item.halftime_away_score ?? null,
      matchday: item.matchday ?? null,
      round: item.round ?? null,
      stage: item.stage ?? null,
      lastSyncedAt: item.last_synced_at ?? new Date().toISOString(),
      competition: {
        id: item.competition_id ?? "",
        name: item.competition_name ?? "",
        key: item.competition_key ?? "",
        logoUrl: item.competition_logo_url ?? null,
      },
      homeTeam: {
        id: item.home_team_id ?? "",
        name: item.home_team_name ?? "",
        shortName: item.home_team_short_name ?? null,
        logoUrl: item.home_team_logo_url ?? null,
      },
      awayTeam: {
        id: item.away_team_id ?? "",
        name: item.away_team_name ?? "",
        shortName: item.away_team_short_name ?? null,
        logoUrl: item.away_team_logo_url ?? null,
      },
      venue: item.venue_name
        ? {
            name: item.venue_name,
            city: item.venue_city ?? null,
          }
        : null,
    };
  });

  let latestSync: string | null = null;
  if (fixtures.length > 0) {
    const timestamps = fixtures
      .map((f) => new Date(f.lastSyncedAt).getTime())
      .filter((t) => !Number.isNaN(t));
    if (timestamps.length > 0) {
      latestSync = new Date(Math.max(...timestamps)).toISOString();
    }
  }

  let freshness: TodaysGamesResponse["freshness"] = "current";
  if (latestSync) {
    const ageMs = Date.now() - new Date(latestSync).getTime();
    if (ageMs > 6 * 3600 * 1000) {
      freshness = "stale";
    }
  } else if (fixtures.length === 0) {
    freshness = "current";
  }

  return {
    fixtures,
    dateIso: targetDateIso,
    todayDateIso: todayIso,
    userTimezone,
    freshness,
    lastSyncedAt: latestSync,
    totalCount: fixtures.length,
  };
}
