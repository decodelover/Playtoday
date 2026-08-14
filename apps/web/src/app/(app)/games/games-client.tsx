"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  PublicFixtureDisplay,
  TodaysGamesResponse,
} from "../../../lib/games-service";
import styles from "./games.module.css";

function formatKickoffTime(kickoffIso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
    }).format(new Date(kickoffIso));
  } catch {
    return kickoffIso.substring(11, 16);
  }
}

function formatDateHeader(dateIso: string): string {
  try {
    const parts = dateIso.split("-");
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    const date = new Date(Date.UTC(y, m - 1, d));
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateIso;
  }
}

function StatusBadge({ fixture }: Readonly<{ fixture: PublicFixtureDisplay }>) {
  if (
    fixture.status === "live" ||
    fixture.status === "halftime" ||
    fixture.status === "extra_time" ||
    fixture.status === "penalties"
  ) {
    return (
      <span className={styles.liveBadge}>
        <span className={styles.liveDot} aria-hidden="true" />
        LIVE {fixture.homeScore ?? 0} - {fixture.awayScore ?? 0}
      </span>
    );
  }

  if (fixture.status === "finished") {
    return (
      <span className={styles.finishedBadge}>
        FT {fixture.homeScore ?? 0} - {fixture.awayScore ?? 0}
      </span>
    );
  }

  if (fixture.status === "postponed") {
    return <span className={styles.postponedBadge}>POSTPONED</span>;
  }

  if (fixture.status === "cancelled") {
    return <span className={styles.postponedBadge}>CANCELLED</span>;
  }

  if (fixture.status === "abandoned") {
    return <span className={styles.postponedBadge}>ABANDONED</span>;
  }

  return <span className={styles.scheduledBadge}>SCHEDULED</span>;
}

export function GamesClient({
  initialData,
}: Readonly<{ initialData: TodaysGamesResponse }>) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(initialData.dateIso);
  const [selectedCompetition, setSelectedCompetition] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const fixtures = initialData.fixtures;
  const userTimezone = initialData.userTimezone;
  const freshness = initialData.freshness;
  const lastSyncedAt = initialData.lastSyncedAt;

  // Derive available competitions from fixtures
  const competitions = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of fixtures) {
      if (f.competition.id && f.competition.name) {
        map.set(f.competition.id, f.competition.name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [fixtures]);

  // Filter fixtures based on competition & status selection
  const filteredFixtures = useMemo(() => {
    return fixtures.filter((f) => {
      if (selectedCompetition !== "all" && f.competition.id !== selectedCompetition) {
        return false;
      }
      if (selectedStatus === "live") {
        return (
          f.status === "live" ||
          f.status === "halftime" ||
          f.status === "extra_time" ||
          f.status === "penalties"
        );
      }
      if (selectedStatus === "scheduled") {
        return f.status === "scheduled";
      }
      if (selectedStatus === "finished") {
        return f.status === "finished";
      }
      return true;
    });
  }, [fixtures, selectedCompetition, selectedStatus]);

  // Date step helper (Prev day / Next day)
  const shiftDate = (days: number) => {
    try {
      const parts = selectedDate.split("-");
      const y = Number(parts[0]);
      const m = Number(parts[1]);
      const d = Number(parts[2]);
      const current = new Date(Date.UTC(y, m - 1, d));
      current.setUTCDate(current.getUTCDate() + days);
      const nextDate = current.toISOString().split("T")[0] ?? selectedDate;
      setSelectedDate(nextDate);
      router.push(`/games?date=${nextDate}`);
    } catch {
      // fallback
    }
  };

  const isToday = selectedDate === initialData.todayDateIso;

  return (
    <div className={styles.gamesContainer}>
      {/* Primary Control Bar */}
      <div className={styles.controlBar}>
        <div className={styles.dateNav}>
          <button
            aria-label="Previous day"
            className={styles.dateBtn}
            onClick={() => shiftDate(-1)}
            type="button"
          >
            ←
          </button>
          <div className={styles.dateLabelGroup}>
            <span className={styles.dateHeader}>{formatDateHeader(selectedDate)}</span>
            <span className={styles.timezoneNotice}>Timezone: {userTimezone}</span>
          </div>
          <button
            aria-label="Next day"
            className={styles.dateBtn}
            onClick={() => shiftDate(1)}
            type="button"
          >
            →
          </button>
          {!isToday ? (
            <button
              className={styles.todayResetBtn}
              onClick={() => router.push("/games")}
              type="button"
            >
              Today
            </button>
          ) : null}
        </div>

        {/* Filters */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="competition-select">
            Competition
          </label>
          <select
            className={styles.filterSelect}
            id="competition-select"
            onChange={(e) => setSelectedCompetition(e.target.value)}
            value={selectedCompetition}
          >
            <option value="all">All Competitions ({fixtures.length})</option>
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className={styles.filterLabel} htmlFor="status-select">
            Status
          </label>
          <select
            className={styles.filterSelect}
            id="status-select"
            onChange={(e) => setSelectedStatus(e.target.value)}
            value={selectedStatus}
          >
            <option value="all">All Statuses</option>
            <option value="live">Live Matches</option>
            <option value="scheduled">Upcoming / Scheduled</option>
            <option value="finished">Finished (FT)</option>
          </select>
        </div>
      </div>

      {/* Freshness Banner */}
      <div className={styles.freshnessRow}>
        <div className={styles.freshnessMeta}>
          <span className={styles.pulseIndicator} data-freshness={freshness} />
          <span className={styles.freshnessText}>
            {freshness === "current"
              ? "Data current"
              : freshness === "unavailable"
                ? "Fixture data is temporarily unavailable"
                : "Data delayed"}
            {lastSyncedAt
              ? `, updated ${new Date(lastSyncedAt).toLocaleTimeString()}`
              : ""}
          </span>
        </div>
        <span className={styles.countTag}>
          Showing {filteredFixtures.length} of {fixtures.length} fixtures
        </span>
      </div>

      {/* Fixtures Display Grid */}
      {filteredFixtures.length > 0 ? (
        <div className={styles.fixturesGrid}>
          {filteredFixtures.map((fixture) => (
            <FixtureCard fixture={fixture} key={fixture.id} timezone={userTimezone} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyStateContainer}>
          <h3 className={styles.emptyTitle}>
            {freshness === "unavailable"
              ? "Fixture data is temporarily unavailable"
              : "No football fixtures are available"}
          </h3>
          <p className={styles.emptyText}>
            {freshness === "unavailable"
              ? "Please try again shortly."
              : "Try another date or clear the current filters."}
          </p>
          <div className={styles.emptyActions}>
            {selectedCompetition !== "all" || selectedStatus !== "all" ? (
              <button
                className={styles.resetFiltersBtn}
                onClick={() => {
                  setSelectedCompetition("all");
                  setSelectedStatus("all");
                }}
                type="button"
              >
                Reset Filters
              </button>
            ) : null}
            <Link className={styles.analystLinkBtn} href="/games">
              Back to today
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function FixtureCard({
  fixture,
  timezone,
}: Readonly<{
  fixture: PublicFixtureDisplay;
  timezone: string;
}>) {
  return (
    <article className={styles.fixtureCard} data-status={String(fixture.status)}>
      <div className={styles.cardHeader}>
        <span className={styles.compName}>{fixture.competition.name}</span>
        <StatusBadge fixture={fixture} />
      </div>

      <div className={styles.matchBody}>
        <div className={styles.teamRow}>
          <span className={styles.teamBadgePill}>H</span>
          <span className={styles.teamName}>{fixture.homeTeam.name}</span>
          <span className={styles.scoreVal}>{fixture.homeScore ?? "-"}</span>
        </div>

        <div className={styles.teamRow}>
          <span className={styles.teamBadgePill} data-away>
            A
          </span>
          <span className={styles.teamName}>{fixture.awayTeam.name}</span>
          <span className={styles.scoreVal}>{fixture.awayScore ?? "-"}</span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.kickoffTime}>
          {formatKickoffTime(fixture.kickoffAt, timezone)}
        </span>
        {fixture.venue?.name ? (
          <span className={styles.venueName}>{fixture.venue.name}</span>
        ) : (
          <span className={styles.roundName}>{fixture.round ?? "Regular Season"}</span>
        )}
      </div>
    </article>
  );
}
