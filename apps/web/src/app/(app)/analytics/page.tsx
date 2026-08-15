import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function AnalyticsPage() {
  const route = getShellRoute("analytics");
  return (
    <WorkspacePageWrapper
      badgeText="PREDICTION ANALYTICS NOT ENABLED"
      route={route}
      subtitle="Prediction accuracy, yield, and settlement analytics are not available in Phase 4C."
    >
      <div className={styles.workspacePanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <span className={styles.panelBadge}>PERFORMANCE AUDIT</span>
            <h2 className={styles.panelTitle}>Analytics & Verification Suite</h2>
          </div>
          <div className={styles.panelActions}>
            <Link className={styles.actionBtnSecondary} href="/history">
              Prediction History
            </Link>
            <Link className={styles.actionBtnPrimary} href="/daily-odds">
              Current Odds
            </Link>
          </div>
        </div>

        <div className={styles.panelGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📈</span>
              <h3>Accuracy Audit Pipeline</h3>
            </div>
            <p>
              No model confidence or accuracy record exists yet. This area will remain
              unavailable until a tested prediction system publishes auditable records.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>⚡</span>
              <h3>Settlement Worker</h3>
            </div>
            <p>
              The settlement worker is not operational. Fixture results are canonical
              sports data and are not presented as settled predictions.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🏆</span>
              <h3>Yield & ROI Analytics</h3>
            </div>
            <p>
              Yield and ROI require real published selections and settlement records.
              PlayToday does not calculate or display them in this phase.
            </p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
