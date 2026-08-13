import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function HistoryPage() {
  const route = getShellRoute("history");
  return (
    <WorkspacePageWrapper
      badgeText="AUDITED HISTORICAL RECORDS"
      route={route}
      subtitle="Verified prediction history, transparent outcome archives, and historical yield audit logs."
    >
      <div className={styles.workspacePanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <span className={styles.panelBadge}>OUTCOME ARCHIVE</span>
            <h2 className={styles.panelTitle}>Prediction History &amp; Audit Logs</h2>
          </div>
          <div className={styles.panelActions}>
            <Link className={styles.actionBtnSecondary} href="/analytics">
              View Analytics
            </Link>
            <Link className={styles.actionBtnPrimary} href="/daily-odds">
              Today&apos;s Picks
            </Link>
          </div>
        </div>

        <div className={styles.panelGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📜</span>
              <h3>Immutable Settlement Logs</h3>
            </div>
            <p>
              Every published prediction is logged prior to kickoff and settled
              automatically from official provider match scores.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🛡️</span>
              <h3>Zero Deletion Integrity</h3>
            </div>
            <p>
              PlayToday never deletes or retroactively modifies lost predictions. 100%
              transparent historical accuracy tracking.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🔍</span>
              <h3>Search &amp; Filter Archives</h3>
            </div>
            <p>
              Filter historical picks by league, odds range, date, or outcome status.
            </p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
