import Link from "next/link";
import { getAuthenticatedAccountSettings } from "../../../lib/account-settings-service";
import { getTodaysGames } from "../../../lib/games-service";
import { getDailyEdgeForDate } from "../../../lib/daily-edge-service";
import {
  ActivityIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  FootballIcon,
  GridIcon,
  ShieldIcon,
} from "../../../components/dashboard/dashboard-icons";
import styles from "./overview.module.css";

const liveStatuses = new Set(["live", "halftime", "extra_time", "penalties"]);
const upcomingStatuses = new Set(["scheduled", "delayed"]);

function formatKickoff(kickoffIso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(kickoffIso));
}

function formatStatus(status: string): string {
  if (status === "halftime") {
    return "Half-time";
  }
  if (status === "extra_time") {
    return "Extra time";
  }
  return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
}

export default async function OverviewPage() {
  const account = await getAuthenticatedAccountSettings();
  const userTimezone = account?.preferences.timezone ?? "UTC";
  const displayName = account?.profile?.display_name ?? "there";
  const todayIso = new Date().toISOString().split("T")[0]!;
  const [todaysData, dailyEdge] = await Promise.all([
    getTodaysGames({ userTimezone }),
    getDailyEdgeForDate(todayIso),
  ]);
  const liveFixtures = todaysData.fixtures.filter((fixture) =>
    liveStatuses.has(fixture.status),
  );
  const upcomingFixtures = todaysData.fixtures.filter((fixture) =>
    upcomingStatuses.has(fixture.status),
  );
  const finishedFixtures = todaysData.fixtures.filter(
    (fixture) => fixture.status === "finished",
  );
  const competitionCount = new Set(
    todaysData.fixtures.map((fixture) => fixture.competition.id),
  ).size;
  const radarFixtures = [
    ...liveFixtures,
    ...upcomingFixtures,
    ...finishedFixtures,
  ].slice(0, 6);

  return (
    <div className={styles.overviewContainer}>
      <section aria-label="Dashboard summary" className={styles.heroBanner}>
        <div className={styles.heroMain}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.statusPill}>
              <FootballIcon size={13} />
              Football today
            </span>
            <span className={styles.timezonePill}>
              <ClockIcon size={13} />
              <span>{userTimezone}</span>
            </span>
          </div>
          <h1 className={styles.heroTitle}>Welcome back, {displayName}</h1>
          <p className={styles.heroSubtitle}>
            Follow today&apos;s fixtures, live scores, and recent results in your local
            time.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link className={styles.actionPrimary} href="/games">
            <CalendarIcon size={16} />
            <span>View today&apos;s games</span>
          </Link>
        </div>
      </section>

      <section aria-label="Today at a glance" className={styles.kpiScrollContainer}>
        <div className={styles.kpiGrid}>
          {[
            {
              label: "Fixtures",
              value: todaysData.totalCount,
              note: `${competitionCount} competitions`,
              icon: <FootballIcon size={18} />,
            },
            {
              label: "Live now",
              value: liveFixtures.length,
              note: liveFixtures.length > 0 ? "Scores in progress" : "No live games",
              icon: <ActivityIcon size={18} />,
            },
            {
              label: "Upcoming",
              value: upcomingFixtures.length,
              note: "Kickoffs still ahead",
              icon: <ClockIcon size={18} />,
            },
            {
              label: "Finished",
              value: finishedFixtures.length,
              note: "Final scores today",
              icon: <GridIcon size={18} />,
            },
          ].map((metric) => (
            <Link className={styles.kpiCard} href="/games" key={metric.label}>
              <div className={styles.kpiTop}>
                <div className={styles.kpiIconWrapper}>{metric.icon}</div>
                <span className={styles.kpiTag}>{metric.label}</span>
              </div>
              <div>
                <div className={styles.kpiValueRow}>
                  <span className={styles.kpiValue}>{metric.value}</span>
                </div>
                <p className={styles.kpiFootnote}>{metric.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Official Daily Edge Section */}
      <section aria-label="Official Daily Edge" className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h2 className={styles.sectionTitle}>Daily Edge</h2>
              {dailyEdge?.status === "published" && (
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#00e599", background: "rgba(0,229,153,0.12)", padding: "0.2rem 0.6rem", borderRadius: "9999px" }}>
                  {dailyEdge.originalCombinedOdds?.toFixed(2)}x PUBLISHED
                </span>
              )}
              {dailyEdge?.status === "pass_day" && (
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.12)", padding: "0.2rem 0.6rem", borderRadius: "9999px" }}>
                  PASS DAY
                </span>
              )}
            </div>
            <p className={styles.sectionSubtitle}>
              Official daily sports intelligence targeting ~2.00 combined decimal odds.
            </p>
          </div>
          <Link className={styles.sectionActionLink} href="/daily-edge">
            <span>View details</span>
            <ChevronRightIcon size={15} />
          </Link>
        </div>

        {dailyEdge?.status === "published" && dailyEdge.legs.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem 1.25rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff" }}>
                {dailyEdge.legs.map((l) => l.fixture?.homeTeamName ?? "Leg").join(" + ")}
              </span>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#00e599" }}>
                {dailyEdge.originalCombinedOdds?.toFixed(2)}x
              </span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
              {dailyEdge.legs.length} legs on verified bookmaker <strong>{dailyEdge.bookmakerName || "Betfair"}</strong>
            </div>
          </div>
        ) : dailyEdge?.status === "pass_day" ? (
          <div style={{ padding: "1rem 1.25rem", background: "rgba(245,158,11,0.04)", borderRadius: "12px", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.25rem" }}>🛡️</span>
            <span style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>
              {dailyEdge.passReasonText || "Disciplined risk management: No selections satisfied our strict model standards today."}
            </span>
          </div>
        ) : (
          <div style={{ padding: "1rem 1.25rem", color: "#94a3b8", fontSize: "0.88rem" }}>
            Daily Edge is evaluating today&apos;s upcoming fixtures and odds.
          </div>
        )}
      </section>

      <div className={styles.dashboardGrid}>
        <section aria-label="Today's match radar" className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <h2 className={styles.sectionTitle}>Today&apos;s matches</h2>
              <p className={styles.sectionSubtitle}>
                Fixture times, match status, and available scores in one place.
              </p>
            </div>
            <Link className={styles.sectionActionLink} href="/games">
              <span>View all</span>
              <ChevronRightIcon size={15} />
            </Link>
          </div>

          {todaysData.freshness === "unavailable" ? (
            <div className={styles.matchEmpty}>
              <h3 className={styles.matchEmptyTitle}>
                Fixture data is temporarily unavailable
              </h3>
              <p className={styles.matchEmptyText}>Please try again shortly.</p>
            </div>
          ) : radarFixtures.length > 0 ? (
            <div className={styles.matchList}>
              {radarFixtures.map((fixture) => {
                const isLive = liveStatuses.has(fixture.status);
                const showScore = isLive || fixture.status === "finished";
                return (
                  <Link className={styles.matchRow} href="/games" key={fixture.id}>
                    <div className={styles.matchLeft}>
                      <div className={styles.matchIconBadge}>
                        <FootballIcon size={18} />
                      </div>
                      <div className={styles.matchInfo}>
                        <span className={styles.matchCompName}>
                          {fixture.competition.name}
                        </span>
                        <span className={styles.matchTeams}>
                          {fixture.homeTeam.name} vs {fixture.awayTeam.name}
                        </span>
                      </div>
                    </div>
                    <div className={styles.matchRight}>
                      <div className={styles.matchScoreGroup}>
                        <span className={styles.matchScore}>
                          {showScore
                            ? `${fixture.homeScore ?? "-"} - ${fixture.awayScore ?? "-"}`
                            : formatKickoff(fixture.kickoffAt, userTimezone)}
                        </span>
                        <span
                          className={styles.matchStatusPill}
                          data-live={isLive ? "true" : "false"}
                        >
                          {formatStatus(fixture.status)}
                        </span>
                      </div>
                      <ChevronRightIcon size={16} />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className={styles.matchEmpty}>
              <div className={styles.matchEmptyIcon}>
                <FootballIcon size={24} />
              </div>
              <h3 className={styles.matchEmptyTitle}>No football fixtures today</h3>
              <p className={styles.matchEmptyText}>
                No football fixtures are available for this date in your timezone.
              </p>
            </div>
          )}
        </section>

        <section aria-label="Fixture data status" className={styles.intelligencePanel}>
          <div className={styles.intelligenceHeader}>
            <div>
              <h2 className={styles.intelligenceTitle}>Data status</h2>
            </div>
            <ActivityIcon size={18} />
          </div>
          <div className={styles.matrixGrid}>
            <div className={styles.matrixCard}>
              <div className={styles.matrixHeader}>
                <div className={styles.matrixIcon}>
                  <ClockIcon size={18} />
                </div>
                <div>
                  <h3 className={styles.matrixTitle}>
                    {todaysData.freshness === "stale" ||
                    todaysData.freshness === "delayed"
                      ? "Data delayed"
                      : todaysData.freshness === "unavailable"
                        ? "Data unavailable"
                        : "Data current"}
                  </h3>
                  <span className={styles.matrixTag}>
                    {todaysData.lastSyncedAt
                      ? `Updated ${formatKickoff(todaysData.lastSyncedAt, userTimezone)}`
                      : "No update recorded for this date"}
                  </span>
                </div>
              </div>
              <p className={styles.matrixBody}>
                Fixture timestamps remain in UTC and are shown here in {userTimezone}.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section aria-label="Responsible play">
        <div className={styles.monitorBanner}>
          <div className={styles.monitorInfo}>
            <div className={styles.monitorIcon}>
              <ShieldIcon size={17} />
            </div>
            <p className={styles.monitorText}>
              Match information is provided for analysis. Set personal limits that work
              for you.
            </p>
          </div>
          <Link className={styles.monitorLink} href="/settings/responsible-play">
            Responsible play controls
          </Link>
        </div>
      </section>
    </div>
  );
}
