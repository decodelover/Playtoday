import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function SubscriptionPage() {
  const route = getShellRoute("subscription");
  return (
    <WorkspacePageWrapper
      badgeText="ACCOUNT SUBSCRIPTION MODULE"
      route={route}
      subtitle="Manage your PlayToday tier, plan capabilities, and account subscription information."
    >
      <div className={styles.workspacePanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <span className={styles.panelBadge}>MEMBERSHIP TIER</span>
            <h2 className={styles.panelTitle}>Subscription & Plans</h2>
          </div>
          <div className={styles.panelActions}>
            <Link className={styles.actionBtnSecondary} href="/settings">
              Settings
            </Link>
            <Link className={styles.actionBtnPrimary} href="/support">
              Help Center
            </Link>
          </div>
        </div>

        <div className={styles.panelGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>💳</span>
              <h3>Current Access Level</h3>
            </div>
            <p>
              Your account can view canonical football fixtures and current provider
              odds. Prediction picks and target-odds tools are not enabled.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>⚡</span>
              <h3>Pro & VIP Intelligence</h3>
            </div>
            <p>
              Future plan capabilities are not configured and are not promised as part
              of the current subscription screen.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🔒</span>
              <h3>Billing & Security</h3>
            </div>
            <p>Billing and paid subscriptions are not configured in this phase.</p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
