import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function DailyOddsPage() {
  const route = getShellRoute("daily-odds");
  return (
    <WorkspacePageWrapper
      badgeText="DAILY EDGE INTELLIGENCE"
      route={route}
      subtitle="PlayToday official daily sports picks, model probability ratings, and bookmaker odds comparison."
    >
      <div className={styles.workspacePanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <span className={styles.panelBadge}>OFFICIAL SELECTIONS</span>
            <h2 className={styles.panelTitle}>Daily Edge & Picks</h2>
          </div>
          <div className={styles.panelActions}>
            <Link className={styles.actionBtnSecondary} href="/selections">
              My Saved Selections
            </Link>
            <Link className={styles.actionBtnPrimary} href="/target-odds">
              Target Odds Builder
            </Link>
          </div>
        </div>

        <div className={styles.panelGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>💎</span>
              <h3>High-Confidence Picks</h3>
            </div>
            <p>
              Mathematical value predictions calculated against canonical provider odds
              with transparent probability scoring.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🇳🇬</span>
              <h3>Bookmaker Odds Comparison</h3>
            </div>
            <p>
              Compare odds across target platforms (SportyBet, Bet9ja, MSport) to ensure
              maximum value on every selection.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>✅</span>
              <h3>Transparent Settlement</h3>
            </div>
            <p>
              Every published daily pick is automatically settled and archived in
              Prediction History for audited accountability.
            </p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
