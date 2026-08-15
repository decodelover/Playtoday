"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./daily-edge.module.css";
import type { DailyEdgePublicationDto } from "../../../lib/daily-edge-service";

interface DailyEdgeClientProps {
  todayPublication: DailyEdgePublicationDto | null;
  history: DailyEdgePublicationDto[];
  userTimezone: string;
}

export function DailyEdgeClient({
  todayPublication,
  history,
  userTimezone,
}: DailyEdgeClientProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    todayPublication?.publicationDate || new Date().toISOString().split("T")[0]!
  );

  const activePub =
    selectedDate === todayPublication?.publicationDate
      ? todayPublication
      : history.find((h) => h.publicationDate === selectedDate) || todayPublication;

  const formatTime = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: userTimezone,
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  return (
    <div className={styles.pageStack}>
      {/* Top Bar / Status */}
      <header className={styles.topBar}>
        <div className={styles.topBarContent}>
          <span className={styles.eyebrow}>OFFICIAL RESEARCH PUBLICATION</span>
          <h2 className={styles.topBarTitle}>
            Daily Edge — {activePub?.publicationDate || selectedDate}
          </h2>
        </div>
        <div>
          {activePub?.status === "published" && (
            <span className={styles.statusPill} data-status="published">
              ● Official Ticket Published
            </span>
          )}
          {activePub?.status === "pass_day" && (
            <span className={styles.statusPill} data-status="pass_day">
              ● Official Pass Day
            </span>
          )}
          {(!activePub || activePub.status === "evaluating") && (
            <span className={styles.statusPill} data-status="evaluating">
              ● Evaluating Live Schedule
            </span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      {activePub?.status === "published" && (
        <section className={styles.ticketCard} aria-label="Official Daily Edge Ticket">
          <div className={styles.ticketHeader}>
            <div className={styles.oddsDisplay}>
              <span className={styles.oddsLabel}>Published Combined Odds</span>
              <span className={styles.oddsValue}>
                {activePub.originalCombinedOdds?.toFixed(2)}x
              </span>
            </div>

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Verified Bookmaker</span>
                <span className={styles.metaVal}>{activePub.bookmakerName || "Betfair"}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Target Multiplier</span>
                <span className={styles.metaVal}>{activePub.targetMultiplier.toFixed(2)}x</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Selections</span>
                <span className={styles.metaVal}>{activePub.legs.length} High-Value Legs</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Policy Version</span>
                <span className={styles.metaVal}>{activePub.policyVersion}</span>
              </div>
            </div>
          </div>

          {/* Legs Stack */}
          <div className={styles.legsStack}>
            {activePub.legs.map((leg) => (
              <article key={leg.id} className={styles.legCard}>
                <div className={styles.legTop}>
                  <div>
                    <h3 className={styles.legMatchTitle}>
                      {leg.fixture?.homeTeamName || "Home Team"} vs{" "}
                      {leg.fixture?.awayTeamName || "Away Team"}
                    </h3>
                  </div>
                  <span className={styles.legLeagueBadge}>
                    {leg.fixture?.competitionName || "Football"} • {formatTime(leg.kickoffAt)}
                  </span>
                </div>

                <div className={styles.legContent}>
                  <div className={selectionLabelKey(leg.selectionKey)}>
                    <span className={styles.marketTitle}>{leg.marketName}</span>
                    <strong className={styles.selectionTitle}>{leg.selectionName}</strong>
                  </div>

                  <div className={styles.legOddsBlock}>
                    <span className={styles.probabilityBadge}>
                      {(leg.modelProbability * 100).toFixed(0)}% Probability
                    </span>
                    <span className={styles.legOddsNumber}>
                      {leg.originalDecimalOdds.toFixed(2)}
                    </span>
                  </div>
                </div>

                {leg.tacticalRationale && (
                  <p className={styles.tacticalText}>{leg.tacticalRationale}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {activePub?.status === "pass_day" && (
        <section className={styles.passDayCard} aria-label="Official Pass Day Notice">
          <div className={styles.passDayIcon} aria-hidden="true">
            🛡️
          </div>
          <h3 className={styles.passDayTitle}>Official Pass Day</h3>
          <p className={styles.passDayText}>
            {activePub.passReasonText ||
              "No selections satisfied our mathematical confidence and odds value thresholds for today's fixtures."}
          </p>
          <div className={styles.passDayDisciplineBadge}>
            ✓ Disciplined Risk Management Enforced
          </div>
        </section>
      )}

      {/* Responsible Play Notice */}
      <div className={styles.responsibleBanner}>
        <span aria-hidden="true">ℹ️</span>
        <span>
          <strong>Play Responsibly:</strong> The Daily Edge provides objective statistical
          probabilities, not guaranteed results. We enforce strict mathematical value and never
          compromise quality merely to reach ~2.00 odds. Always stake within your personal limits.
        </span>
      </div>

      {/* Historical Publications Archive */}
      {history.length > 0 && (
        <section className={styles.historySection} aria-label="Daily Edge Publication History">
          <h3 className={styles.historyTitle}>Publication Archive</h3>
          <div className={styles.historyTableWrapper}>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Outcome</th>
                  <th>Published Odds</th>
                  <th>Leg Count</th>
                  <th>Bookmaker</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((pub) => (
                  <tr key={pub.id}>
                    <td>
                      <strong>{pub.publicationDate}</strong>
                    </td>
                    <td>
                      {pub.status === "published" ? (
                        <span style={{ color: "#00e599", fontWeight: 600 }}>Ticket Published</span>
                      ) : (
                        <span style={{ color: "#f59e0b", fontWeight: 600 }}>Pass Day</span>
                      )}
                    </td>
                    <td>
                      {pub.originalCombinedOdds
                        ? `${pub.originalCombinedOdds.toFixed(2)}x`
                        : "—"}
                    </td>
                    <td>{pub.legs.length > 0 ? `${pub.legs.length} Legs` : "—"}</td>
                    <td>{pub.bookmakerName || "—"}</td>
                    <td>
                      <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                        Awaiting Settlement
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function selectionLabelKey(key?: string): string {
  return styles.selectionBlock ?? "";
}
