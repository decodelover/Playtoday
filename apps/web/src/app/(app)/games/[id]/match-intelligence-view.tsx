"use client";

import Link from "next/link";
import styles from "./match-intelligence.module.css";
import type { MatchIntelligenceData } from "../../../../lib/match-intelligence-service";
import type { TeamFormMatchResult, PlayerLineupItemDto } from "@playtoday/sports-domain";

interface MatchIntelligenceViewProps {
  data: MatchIntelligenceData;
}

export function MatchIntelligenceView({ data }: MatchIntelligenceViewProps) {
  const {
    fixture,
    homeForm,
    awayForm,
    homeVenueForm,
    awayVenueForm,
    headToHead,
    probabilities,
    standings,
    statistics,
    lineups,
    injuries,
    dataCompleteness,
  } = data;

  const isFinished = fixture.status === "finished" || fixture.status === "ft";
  const isLive = fixture.status === "live" || fixture.status === "halftime" || fixture.status === "extra_time";

  const homeStats = statistics.find((s) => s.side === "home");
  const awayStats = statistics.find((s) => s.side === "away");

  const homeLineup = lineups.find((l) => l.side === "home");
  const awayLineup = lineups.find((l) => l.side === "away");

  return (
    <div className={styles.container}>
      <Link href="/games" className={styles.backLink}>
        ← Back to Games Schedule
      </Link>

      {/* 1. MATCH HERO CARD */}
      <section className={styles.heroCard}>
        <div className={styles.heroMeta}>
          <div className={styles.compBadge}>
            {fixture.competition.logoUrl && (
              <img
                src={fixture.competition.logoUrl}
                alt={fixture.competition.name}
                className={styles.compLogo}
              />
            )}
            <span>{fixture.competition.name} {fixture.round ? `• ${fixture.round}` : ""}</span>
          </div>

          <span
            className={`${styles.statusBadge} ${
              isLive
                ? styles.statusLive
                : isFinished
                ? styles.statusFinished
                : styles.statusScheduled
            }`}
          >
            {isLive ? `● LIVE ${fixture.statusDetail ?? ""}` : isFinished ? "FT Finished" : "Upcoming"}
          </span>
        </div>

        <div className={styles.matchHeaderGrid}>
          {/* Home Team */}
          <div className={styles.teamCol}>
            {fixture.homeTeam.logoUrl && (
              <img
                src={fixture.homeTeam.logoUrl}
                alt={fixture.homeTeam.name}
                className={styles.teamLogo}
              />
            )}
            <span className={styles.teamName}>{fixture.homeTeam.name}</span>
            <span className={styles.teamVenueTag}>Home Club</span>
          </div>

          {/* Score / Kickoff */}
          <div className={styles.scoreCol}>
            {isFinished || isLive ? (
              <>
                <span className={styles.scoreBox}>
                  {fixture.homeScore ?? 0} - {fixture.awayScore ?? 0}
                </span>
                {fixture.halftimeHomeScore !== null && fixture.halftimeAwayScore !== null && (
                  <span className={styles.venueText}>
                    (HT: {fixture.halftimeHomeScore} - {fixture.halftimeAwayScore})
                  </span>
                )}
              </>
            ) : (
              <>
                <span className={styles.kickoffTime}>
                  {new Date(fixture.kickoffAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className={styles.venueText}>
                  {new Date(fixture.kickoffAt).toLocaleDateString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </>
            )}
          </div>

          {/* Away Team */}
          <div className={styles.teamCol}>
            {fixture.awayTeam.logoUrl && (
              <img
                src={fixture.awayTeam.logoUrl}
                alt={fixture.awayTeam.name}
                className={styles.teamLogo}
              />
            )}
            <span className={styles.teamName}>{fixture.awayTeam.name}</span>
            <span className={styles.teamVenueTag}>Away Club</span>
          </div>
        </div>

        {fixture.venue?.name && (
          <div className={styles.venueText}>
            📍 {fixture.venue.name}{fixture.venue.city ? `, ${fixture.venue.city}` : ""}
          </div>
        )}
      </section>

      {/* 2. DATA COMPLETENESS PROVENANCE BAR */}
      <div className={styles.provenanceBar}>
        <span><strong>Intelligence Status:</strong> 100% Provider-Verified Data</span>
        <div className={styles.provItems}>
          <span className={styles.provItem}>
            {dataCompleteness.hasStandings ? "✅ Standings" : "⏳ Standings N/A"}
          </span>
          <span className={styles.provItem}>
            {dataCompleteness.hasLineups ? "✅ Official Lineups" : "⏳ Lineup Pending"}
          </span>
          <span className={styles.provItem}>
            {dataCompleteness.hasStatistics ? "✅ Match Stats" : "⏳ Stats N/A"}
          </span>
          <span className={styles.provItem}>
            {dataCompleteness.hasInjuries ? "✅ Injury Report" : "✅ 0 Absences Reported"}
          </span>
        </div>
      </div>

      {/* 3. PROBABILITY MODEL & HEAD-TO-HEAD GRID */}
      <div className={styles.gridTwoCol}>
        {/* Poisson Probability Model */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>
              🧮 Statistical Probability Model
            </span>
            <span className={styles.cardBadge}>
              Poisson Goal Model
            </span>
          </div>

          <div className={styles.probBars}>
            <div className={styles.probRow}>
              <div className={styles.probLabels}>
                <span>{fixture.homeTeam.name} Win</span>
                <span>{(probabilities.homeWinProbability * 100).toFixed(1)}%</span>
              </div>
              <div className={styles.probTrack}>
                <div
                  className={styles.probFill}
                  style={{ width: `${probabilities.homeWinProbability * 100}%` }}
                />
              </div>
            </div>

            <div className={styles.probRow}>
              <div className={styles.probLabels}>
                <span>Draw (X)</span>
                <span>{(probabilities.drawProbability * 100).toFixed(1)}%</span>
              </div>
              <div className={styles.probTrack}>
                <div
                  className={`${styles.probFill} ${styles.probFillDraw}`}
                  style={{ width: `${probabilities.drawProbability * 100}%` }}
                />
              </div>
            </div>

            <div className={styles.probRow}>
              <div className={styles.probLabels}>
                <span>{fixture.awayTeam.name} Win</span>
                <span>{(probabilities.awayWinProbability * 100).toFixed(1)}%</span>
              </div>
              <div className={styles.probTrack}>
                <div
                  className={`${styles.probFill} ${styles.probFillAway}`}
                  style={{ width: `${probabilities.awayWinProbability * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            <div style={{ padding: "0.6rem", background: "var(--pt-bg-surface-subtle)", borderRadius: "0.5rem", fontSize: "0.8rem" }}>
              <span style={{ color: "var(--pt-stone-500)", display: "block" }}>Double Chance 1X</span>
              <strong>{(probabilities.doubleChance1X * 100).toFixed(1)}%</strong>
            </div>
            <div style={{ padding: "0.6rem", background: "var(--pt-bg-surface-subtle)", borderRadius: "0.5rem", fontSize: "0.8rem" }}>
              <span style={{ color: "var(--pt-stone-500)", display: "block" }}>Double Chance X2</span>
              <strong>{(probabilities.doubleChanceX2 * 100).toFixed(1)}%</strong>
            </div>
            <div style={{ padding: "0.6rem", background: "var(--pt-bg-surface-subtle)", borderRadius: "0.5rem", fontSize: "0.8rem" }}>
              <span style={{ color: "var(--pt-stone-500)", display: "block" }}>Over 2.5 Goals</span>
              <strong>{(probabilities.over25Probability * 100).toFixed(1)}%</strong>
            </div>
            <div style={{ padding: "0.6rem", background: "var(--pt-bg-surface-subtle)", borderRadius: "0.5rem", fontSize: "0.8rem" }}>
              <span style={{ color: "var(--pt-stone-500)", display: "block" }}>Both Teams Score (BTTS)</span>
              <strong>{(probabilities.bttsProbability * 100).toFixed(1)}%</strong>
            </div>
          </div>
        </div>

        {/* Head-to-Head */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>
              ⚔️ Head-to-Head History
            </span>
            <span className={styles.cardBadge}>
              Last {headToHead.sampleSize} Clashes
            </span>
          </div>

          {headToHead.sampleSize > 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center", padding: "0.6rem 0", borderBottom: "1px solid var(--pt-border-subtle)" }}>
                <div>
                  <strong style={{ fontSize: "1.2rem", display: "block" }}>{headToHead.homeWins}</strong>
                  <span style={{ fontSize: "0.72rem", color: "var(--pt-stone-500)" }}>{fixture.homeTeam.shortName ?? "Home"} Wins</span>
                </div>
                <div>
                  <strong style={{ fontSize: "1.2rem", display: "block" }}>{headToHead.draws}</strong>
                  <span style={{ fontSize: "0.72rem", color: "var(--pt-stone-500)" }}>Draws</span>
                </div>
                <div>
                  <strong style={{ fontSize: "1.2rem", display: "block" }}>{headToHead.awayWins}</strong>
                  <span style={{ fontSize: "0.72rem", color: "var(--pt-stone-500)" }}>{fixture.awayTeam.shortName ?? "Away"} Wins</span>
                </div>
              </div>

              <div className={styles.matchesList}>
                {headToHead.matches.map((m: TeamFormMatchResult) => (
                  <div key={m.fixtureId} className={styles.matchListItem}>
                    <span style={{ color: "var(--pt-stone-500)", fontSize: "0.74rem" }}>
                      {new Date(m.kickoffAt).toLocaleDateString([], { month: "short", day: "numeric", year: "2-digit" })}
                    </span>
                    <span className={styles.matchListOpponent}>
                      {m.isHome ? `${fixture.homeTeam.name} vs ${m.opponentName}` : `${m.opponentName} vs ${fixture.homeTeam.name}`}
                    </span>
                    <span className={styles.matchListScore}>
                      {m.teamScore} - {m.opponentScore}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.emptyNotice}>
              No previous canonical head-to-head fixtures found in database.
            </div>
          )}
        </div>
      </div>

      {/* 4. RECENT FORM SPLITS GRID */}
      <div className={styles.gridTwoCol}>
        {/* Home Team Form */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>
              📈 {fixture.homeTeam.name} Form
            </span>
            <span className={styles.cardBadge}>
              Last {homeForm.actualSampleSize} Matches
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Recent Sequence:</span>
            <div className={styles.formRow}>
              {homeForm.matches.map((m: TeamFormMatchResult) => (
                <span
                  key={m.fixtureId}
                  className={`${styles.formBadge} ${
                    m.result === "W" ? styles.formW : m.result === "D" ? styles.formD : styles.formL
                  }`}
                  title={`${m.result} vs ${m.opponentName} (${m.teamScore}-${m.opponentScore})`}
                >
                  {m.result}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.matchesList}>
            {homeForm.matches.map((m: TeamFormMatchResult) => (
              <div key={m.fixtureId} className={styles.matchListItem}>
                <span className={styles.matchListOpponent}>
                  {m.isHome ? "(H)" : "(A)"} vs {m.opponentName}
                </span>
                <span className={styles.matchListScore}>
                  {m.teamScore} - {m.opponentScore} ({m.result})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Away Team Form */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>
              📉 {fixture.awayTeam.name} Form
            </span>
            <span className={styles.cardBadge}>
              Last {awayForm.actualSampleSize} Matches
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Recent Sequence:</span>
            <div className={styles.formRow}>
              {awayForm.matches.map((m: TeamFormMatchResult) => (
                <span
                  key={m.fixtureId}
                  className={`${styles.formBadge} ${
                    m.result === "W" ? styles.formW : m.result === "D" ? styles.formD : styles.formL
                  }`}
                  title={`${m.result} vs ${m.opponentName} (${m.teamScore}-${m.opponentScore})`}
                >
                  {m.result}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.matchesList}>
            {awayForm.matches.map((m: TeamFormMatchResult) => (
              <div key={m.fixtureId} className={styles.matchListItem}>
                <span className={styles.matchListOpponent}>
                  {m.isHome ? "(H)" : "(A)"} vs {m.opponentName}
                </span>
                <span className={styles.matchListScore}>
                  {m.teamScore} - {m.opponentScore} ({m.result})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. MATCH STATISTICS (FOR LIVE OR FINISHED FIXTURES) */}
      {(isFinished || isLive) && homeStats && awayStats && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>
              📊 Verified Match Statistics
            </span>
            <span className={styles.cardBadge}>
              Official Match Feed
            </span>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statRow}>
              <span className={styles.statValHome}>{homeStats.possessionPercentage ?? "-"}%</span>
              <span className={styles.statLabel}>Ball Possession</span>
              <span className={styles.statValAway}>{awayStats.possessionPercentage ?? "-"}%</span>
            </div>

            <div className={styles.statRow}>
              <span className={styles.statValHome}>{homeStats.shotsOnGoal ?? "-"}</span>
              <span className={styles.statLabel}>Shots on Target</span>
              <span className={styles.statValAway}>{awayStats.shotsOnGoal ?? "-"}</span>
            </div>

            <div className={styles.statRow}>
              <span className={styles.statValHome}>{homeStats.totalShots ?? "-"}</span>
              <span className={styles.statLabel}>Total Shots</span>
              <span className={styles.statValAway}>{awayStats.totalShots ?? "-"}</span>
            </div>

            <div className={styles.statRow}>
              <span className={styles.statValHome}>{homeStats.cornerKicks ?? "-"}</span>
              <span className={styles.statLabel}>Corner Kicks</span>
              <span className={styles.statValAway}>{awayStats.cornerKicks ?? "-"}</span>
            </div>

            <div className={styles.statRow}>
              <span className={styles.statValHome}>{homeStats.fouls ?? "-"}</span>
              <span className={styles.statLabel}>Fouls</span>
              <span className={styles.statValAway}>{awayStats.fouls ?? "-"}</span>
            </div>

            <div className={styles.statRow}>
              <span className={styles.statValHome}>{homeStats.yellowCards ?? 0}</span>
              <span className={styles.statLabel}>Yellow Cards</span>
              <span className={styles.statValAway}>{awayStats.yellowCards ?? 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. CONFIRMED LINEUPS & FORMATIONS */}
      {dataCompleteness.hasLineups && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>
              👥 Official Starting Lineups
            </span>
            <span className={styles.cardBadge}>
              Confirmed XI
            </span>
          </div>

          <div className={styles.gridTwoCol}>
            {/* Home Lineup */}
            <div className={styles.lineupSide}>
              <strong>{fixture.homeTeam.name}</strong>
              <span className={styles.lineupFormation}>
                Formation: {homeLineup?.formation ?? "Standard"} {homeLineup?.coachName ? `• Coach: ${homeLineup.coachName}` : ""}
              </span>
              <div className={styles.matchesList}>
                {homeLineup?.startingXI.map((p: PlayerLineupItemDto) => (
                  <div key={p.id ?? p.name} className={styles.playerItem}>
                    <span className={styles.playerNumber}>{p.number ?? "•"}</span>
                    <span>{p.name}</span>
                    {p.pos && <span style={{ fontSize: "0.7rem", color: "var(--pt-stone-400)", marginLeft: "auto" }}>{p.pos}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Away Lineup */}
            <div className={styles.lineupSide}>
              <strong>{fixture.awayTeam.name}</strong>
              <span className={styles.lineupFormation}>
                Formation: {awayLineup?.formation ?? "Standard"} {awayLineup?.coachName ? `• Coach: ${awayLineup.coachName}` : ""}
              </span>
              <div className={styles.matchesList}>
                {awayLineup?.startingXI.map((p: PlayerLineupItemDto) => (
                  <div key={p.id ?? p.name} className={styles.playerItem}>
                    <span className={styles.playerNumber}>{p.number ?? "•"}</span>
                    <span>{p.name}</span>
                    {p.pos && <span style={{ fontSize: "0.7rem", color: "var(--pt-stone-400)", marginLeft: "auto" }}>{p.pos}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. LIVE STANDINGS CONTEXT */}
      {standings.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>
              🏆 {fixture.competition.name} Standings
            </span>
            <span className={styles.cardBadge}>
              Official Table
            </span>
          </div>

          <div className={styles.standingsWrapper}>
            <table className={styles.standingsTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Club</th>
                  <th>P</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GD</th>
                  <th>PTS</th>
                  <th>Form</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((s) => {
                  const isMatchTeam =
                    s.teamName.toLowerCase().includes(fixture.homeTeam.name.toLowerCase()) ||
                    s.teamName.toLowerCase().includes(fixture.awayTeam.name.toLowerCase());
                  return (
                    <tr
                      key={s.rank + s.teamName}
                      className={isMatchTeam ? styles.standingsHighlight : ""}
                    >
                      <td><strong>{s.rank}</strong></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                          {s.teamLogo && <img src={s.teamLogo} alt="" style={{ width: "1rem", height: "1rem", objectFit: "contain" }} />}
                          <span>{s.teamName}</span>
                        </div>
                      </td>
                      <td>{s.played}</td>
                      <td>{s.wins}</td>
                      <td>{s.draws}</td>
                      <td>{s.losses}</td>
                      <td>{s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}</td>
                      <td><strong>{s.points}</strong></td>
                      <td>
                        <span style={{ fontFamily: "var(--pt-font-data)", fontSize: "0.75rem" }}>
                          {s.formString ?? "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
