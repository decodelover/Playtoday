"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  PublicFixtureDisplay,
  TodaysGamesResponse,
} from "../../../lib/games-service";
import { useLiveFixtures } from "../../../lib/use-live-fixtures";
import styles from "./games.module.css";

const COMMON_TIMEZONES = [
  { id: "auto", label: "Auto (Local Browser)" },
  { id: "Africa/Lagos", label: "Lagos (WAT / UTC+1)" },
  { id: "Europe/London", label: "London (GMT/BST)" },
  { id: "Africa/Johannesburg", label: "Johannesburg (SAST / UTC+2)" },
  { id: "Africa/Nairobi", label: "Nairobi (EAT / UTC+3)" },
  { id: "America/New_York", label: "New York (EST/EDT)" },
  { id: "UTC", label: "UTC (Coordinated Universal)" },
];

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
      <span className={styles.statusBadge} data-live="true">
        <span className={styles.pulseIndicator} aria-hidden="true" />
        LIVE {fixture.homeScore ?? 0} - {fixture.awayScore ?? 0}
      </span>
    );
  }

  if (fixture.status === "finished") {
    return (
      <span className={styles.statusBadge} data-finished="true">
        FT {fixture.homeScore ?? 0} - {fixture.awayScore ?? 0}
      </span>
    );
  }

  if (fixture.status === "postponed") {
    return <span className={styles.statusBadge}>POSTPONED</span>;
  }

  if (fixture.status === "cancelled") {
    return <span className={styles.statusBadge}>CANCELLED</span>;
  }

  if (fixture.status === "abandoned") {
    return <span className={styles.statusBadge}>ABANDONED</span>;
  }

  return <span className={styles.statusBadge}>SCHEDULED</span>;
}

export function GamesClient({
  initialData,
}: Readonly<{ initialData: TodaysGamesResponse }>) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(initialData.dateIso);
  const [selectedCompetition, setSelectedCompetition] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTimezone, setActiveTimezone] = useState<string>(initialData.userTimezone);

  // Auto-detect client timezone if server defaulted to UTC
  useEffect(() => {
    try {
      const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (browserTz && initialData.userTimezone === "UTC") {
        setActiveTimezone(browserTz);
      }
    } catch {
      // Keep server timezone fallback
    }
  }, [initialData.userTimezone]);

  // Real-time live scores and status updates via WebSockets
  const { fixtures, lastLiveEventAt, isLiveConnected } = useLiveFixtures(initialData.fixtures);
  const freshness = initialData.freshness;
  const lastSyncedAt = lastLiveEventAt ?? initialData.lastSyncedAt;

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

  // Filter fixtures based on competition, status selection, and search query
  const filteredFixtures = useMemo(() => {
    return fixtures.filter((f) => {
      if (selectedCompetition !== "all" && f.competition.id !== selectedCompetition) {
        return false;
      }
      if (selectedStatus === "live") {
        if (
          f.status !== "live" &&
          f.status !== "halftime" &&
          f.status !== "extra_time" &&
          f.status !== "penalties"
        ) {
          return false;
        }
      } else if (selectedStatus === "scheduled") {
        if (f.status !== "scheduled") return false;
      } else if (selectedStatus === "finished") {
        if (f.status !== "finished") return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const home = f.homeTeam.name.toLowerCase();
        const away = f.awayTeam.name.toLowerCase();
        const comp = f.competition.name.toLowerCase();
        if (!home.includes(query) && !away.includes(query) && !comp.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [fixtures, selectedCompetition, selectedStatus, searchQuery]);

  // Date step helper
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

  const handleTimezoneChange = (tz: string) => {
    if (tz === "auto") {
      try {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setActiveTimezone(detected || "UTC");
      } catch {
        setActiveTimezone("UTC");
      }
    } else {
      setActiveTimezone(tz);
    }
  };

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
            <span className={styles.timezoneNotice}>
              Timezone: {activeTimezone}
            </span>
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
              onClick={() => {
                setSelectedDate(initialData.todayDateIso);
                router.push("/games");
              }}
              type="button"
            >
              Today
            </button>
          ) : null}
        </div>

        {/* Filters & Search */}
        <div className={styles.filterGroup}>
          <input
            className={styles.filterSelect}
            placeholder="Search teams or leagues..."
            style={{ minWidth: "11rem" }}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

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

          <select
            className={styles.filterSelect}
            id="status-select"
            onChange={(e) => setSelectedStatus(e.target.value)}
            value={selectedStatus}
          >
            <option value="all">All Match Statuses</option>
            <option value="live">Live Matches</option>
            <option value="scheduled">Upcoming / Scheduled</option>
            <option value="finished">Finished (FT)</option>
          </select>

          <select
            className={styles.filterSelect}
            id="tz-select"
            onChange={(e) => handleTimezoneChange(e.target.value)}
            value={
              COMMON_TIMEZONES.some((tz) => tz.id === activeTimezone)
                ? activeTimezone
                : "auto"
            }
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Freshness & Realtime Indicator */}
      <div className={styles.freshnessRow}>
        <div className={styles.freshnessMeta}>
          <span
            className={styles.pulseIndicator}
            data-freshness={freshness}
            title={isLiveConnected ? "Realtime WebSockets Connected" : "Polling"}
          />
          <span className={styles.freshnessText}>
            {isLiveConnected ? "Live WebSockets Active" : "Data Current"}
            {lastSyncedAt
              ? ` • Updated ${new Date(lastSyncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : ""}
          </span>
        </div>
        <span className={styles.countTag}>
          Showing {filteredFixtures.length} of {fixtures.length} matches
        </span>
      </div>

      {/* Fixtures Display Grid */}
      {filteredFixtures.length > 0 ? (
        <div className={styles.fixturesGrid}>
          {filteredFixtures.map((fixture) => (
            <FixtureCard
              fixture={fixture}
              key={fixture.id}
              timezone={activeTimezone}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyStateCard}>
          <div className={styles.emptyIconWrapper}>⚽</div>
          <h3 className={styles.emptyTitle}>No matches found</h3>
          <p className={styles.emptyText}>
            {searchQuery || selectedCompetition !== "all" || selectedStatus !== "all"
              ? "Try clearing your search query or filters."
              : "No fixtures are scheduled for this date."}
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {(searchQuery || selectedCompetition !== "all" || selectedStatus !== "all") && (
              <button
                className={styles.todayResetBtn}
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCompetition("all");
                  setSelectedStatus("all");
                }}
                type="button"
              >
                Clear Filters
              </button>
            )}
            <Link className={styles.analyzeAction} href="/games">
              Return to Today
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
  const isLive =
    fixture.status === "live" ||
    fixture.status === "halftime" ||
    fixture.status === "extra_time" ||
    fixture.status === "penalties";
  const isFinished = fixture.status === "finished";

  return (
    <article className={styles.fixtureCard} data-status={String(fixture.status)}>
      <div className={styles.cardHeader}>
        <span className={styles.compName}>{fixture.competition.name}</span>
        <StatusBadge fixture={fixture} />
      </div>

      <div className={styles.teamsBlock}>
        <div className={styles.teamRow}>
          <div className={styles.teamInfo}>
            <span className={styles.teamLogoPlaceholder}>H</span>
            <span className={styles.teamName}>{fixture.homeTeam.name}</span>
          </div>
          <span className={styles.teamScore}>
            {isLive || isFinished ? (fixture.homeScore ?? 0) : "-"}
          </span>
        </div>

        <div className={styles.teamRow}>
          <div className={styles.teamInfo}>
            <span className={styles.teamLogoPlaceholder}>A</span>
            <span className={styles.teamName}>{fixture.awayTeam.name}</span>
          </div>
          <span className={styles.teamScore}>
            {isLive || isFinished ? (fixture.awayScore ?? 0) : "-"}
          </span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.kickoffTime}>
          {formatKickoffTime(fixture.kickoffAt, timezone)}
        </span>
        <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
          <Link
            className={styles.analyzeAction}
            href={`/games/${fixture.id}`}
            title="View verified standings, form, H2H & lineups"
            style={{ background: "var(--pt-bg-surface-subtle)", color: "var(--pt-stone-700)", border: "1px solid var(--pt-border-default)" }}
          >
            <span>Match Intel</span>
          </Link>
          <Link
            className={styles.analyzeAction}
            href={`/ai-analyst?fixtureId=${fixture.id}`}
            title="Analyze match with AI Analyst"
          >
            <span>AI Chat</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
