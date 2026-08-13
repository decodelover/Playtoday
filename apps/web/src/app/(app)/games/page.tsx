import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function GamesPage() {
  const route = getShellRoute("games");
  return (
    <WorkspacePageWrapper
      badgeText="CANONICAL FIXTURES ACTIVE"
      route={route}
      subtitle="Explore today's scheduled, live, and finished football fixtures populated from API-Football canonical ingestion."
    >
      <div className={styles.workspacePanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <span className={styles.panelBadge}>MATCH CENTER</span>
            <h2 className={styles.panelTitle}>Today&apos;s Canonical Fixtures</h2>
          </div>
          <div className={styles.panelActions}>
            <Link className={styles.actionBtnSecondary} href="/markets">
              View Markets
            </Link>
            <Link className={styles.actionBtnPrimary} href="/daily-odds">
              Daily Edge
            </Link>
          </div>
        </div>

        <div className={styles.panelGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📅</span>
              <h3>Live &amp; Scheduled Matches</h3>
            </div>
            <p>
              Fixtures ingested from top leagues (Premier League, Champions League, La
              Liga, Serie A, Bundesliga).
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>⏱️</span>
              <h3>Real-Time Score Normalization</h3>
            </div>
            <p>
              Raw provider short statuses (<code>NS</code>, <code>1H</code>,{" "}
              <code>HT</code>, <code>FT</code>, <code>PST</code>) are normalized to
              canonical <code>fixture_status</code> enum values.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🏟️</span>
              <h3>Venue &amp; Referee Detail</h3>
            </div>
            <p>
              Match details stored with canonical team UUIDs, stadium names, and
              verified kickoff UTC timestamps.
            </p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
