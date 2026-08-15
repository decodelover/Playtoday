import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function SelectionsPage() {
  const route = getShellRoute("selections");
  return (
    <WorkspacePageWrapper
      badgeText="SAVED SELECTIONS NOT ENABLED"
      route={route}
      subtitle="Saved tickets, movement alerts, and bookmaker code export are not available in the current phase."
    >
      <div className={styles.defaultWorkspaceCard}>
        <div className={styles.defaultCardHeader}>
          <div>
            <h2 className={styles.defaultCardTitle}>No saved selections yet</h2>
            <p className={styles.defaultCardSubtitle}>
              Phase 4C provides verified current odds and market coverage. It does not
              create bookmaker tickets or booking codes.
            </p>
          </div>
        </div>
        <div className={styles.defaultCardBody}>
          <p className={styles.defaultCardText}>
            Review current prices on Daily Odds. Saving selections and tracking alerts
            will remain unavailable until those workflows are implemented and tested.
          </p>
        </div>
        <div className={styles.defaultCardFooter}>
          <Link className={styles.actionBtnPrimary} href="/daily-odds">
            View current odds
          </Link>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
