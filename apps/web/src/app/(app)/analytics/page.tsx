import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function AnalyticsPage() {
  const route = getShellRoute("analytics");
  return (
    <WorkspacePageWrapper
      badgeText="TRANSPARENT METRICS ENGINE"
      route={route}
      subtitle="Transparent performance analytics, accuracy verification, and canonical historical tracking."
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
              Daily Edge
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
              PlayToday tracks model confidence ratings against verified match outcomes
              in the canonical database. Zero post-hoc prediction editing or fictional
              historical records.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>⚡</span>
              <h3>Settlement Worker</h3>
            </div>
            <p>
              Settlement worker automatically reconciles finished fixtures from
              canonical provider feeds into transparent performance analytics.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🏆</span>
              <h3>Yield & ROI Analytics</h3>
            </div>
            <p>
              Comprehensive analytics break down performance across leagues, markets,
              and odds ranges with zero hidden metrics.
            </p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
