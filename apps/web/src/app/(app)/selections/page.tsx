import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function SelectionsPage() {
  const route = getShellRoute("selections");
  return (
    <WorkspacePageWrapper
      badgeText="SELECTIONS WORKSPACE READY"
      route={route}
      subtitle="View your saved selection drafts, customized ticket builds, and bookmaker odds tracking."
    >
      <div className={styles.workspacePanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <span className={styles.panelBadge}>SAVED TICKETS</span>
            <h2 className={styles.panelTitle}>My Saved Selections</h2>
          </div>
          <div className={styles.panelActions}>
            <Link className={styles.actionBtnSecondary} href="/daily-odds">
              Daily Picks
            </Link>
            <Link className={styles.actionBtnPrimary} href="/target-odds">
              Create New Ticket
            </Link>
          </div>
        </div>

        <div className={styles.panelGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📌</span>
              <h3>Saved Selection Drafts</h3>
            </div>
            <p>
              Your saved custom combinations are stored locally with real-time odds
              updates and canonical team mappings.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🇳🇬</span>
              <h3>Bookmaker Code Exporter</h3>
            </div>
            <p>
              Format your selections directly for quick booking on SportyBet, Bet9ja,
              and MSport.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🔔</span>
              <h3>Odds Movement Alerts</h3>
            </div>
            <p>
              Track odds shifts and market movements across target bookmakers prior to
              kickoff.
            </p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
