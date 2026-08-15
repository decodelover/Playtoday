import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function HistoryPage() {
  const route = getShellRoute("history");
  return (
    <WorkspacePageWrapper
      badgeText="PREDICTION HISTORY NOT ENABLED"
      route={route}
      subtitle="No PlayToday predictions or settlement records exist in Phase 4C."
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
              Current Odds
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
              Prediction settlement is not configured. Current bookmaker odds history is
              stored internally and is not presented as prediction history.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🛡️</span>
              <h3>Zero Deletion Integrity</h3>
            </div>
            <p>There are no published PlayToday prediction outcomes to audit yet.</p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🔍</span>
              <h3>Search &amp; Filter Archives</h3>
            </div>
            <p>
              Historical prediction filters will remain unavailable until genuine
              published and settled records exist.
            </p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
