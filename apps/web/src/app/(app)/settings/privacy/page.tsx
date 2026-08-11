import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthenticatedAccountSettings } from "../../../../lib/account-settings-service";
import styles from "../settings.module.css";

export default async function PrivacySettingsPage() {
  const account = await getAuthenticatedAccountSettings();
  if (!account) {
    redirect("/sign-in");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>Privacy & data</h1>
        <p>See the account data PlayToday can currently associate with your login.</p>
      </header>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Stored account data</h2>
          <p>The current account model contains the following categories.</p>
        </div>
        <dl className={styles.dataList}>
          <dt>Authentication</dt>
          <dd>Email identity, confirmation state and account creation time.</dd>
          <dt>Profile</dt>
          <dd>Display name, profile timestamps and onboarding completion state.</dd>
          <dt>Preferences</dt>
          <dd>
            Sports, bookmakers, markets, target odds, analysis style, notifications,
            timezone and responsible-play acknowledgement.
          </dd>
          <dt>Contact messages</dt>
          <dd>
            Contact submissions are stored separately and are not linked to your account
            ID.
          </dd>
        </dl>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Download your data</h2>
          <p>
            The download is generated for your signed-in account and contains only the
            exportable identity, profile and preference fields listed above.
          </p>
        </div>
        <div className={styles.buttonRow}>
          <a className={styles.button} download href="/settings/privacy/export">
            Download JSON
          </a>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.dangerZone}`}>
        <div className={styles.panelHeader}>
          <h2>Delete your account</h2>
          <p>
            Self-service deletion is unavailable while retention requirements for
            account records remain unresolved. To make a privacy request, contact the
            support team for review.
          </p>
        </div>
        <Link className={styles.textLink} href="/contact">
          Contact Privacy Support
        </Link>
      </section>
    </div>
  );
}
