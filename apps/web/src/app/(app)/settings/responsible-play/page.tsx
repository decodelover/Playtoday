import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthenticatedAccountSettings } from "../../../../lib/account-settings-service";
import styles from "../settings.module.css";

export default async function ResponsiblePlaySettingsPage() {
  const account = await getAuthenticatedAccountSettings();
  if (!account) {
    redirect("/sign-in");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>Responsible Play</h1>
        <p>Review the account setting that PlayToday currently stores and enforces.</p>
      </header>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Responsible-play acknowledgement</h2>
          <p>
            {account.preferences.responsible_play_ack
              ? "You confirmed the responsible-play statement when completing onboarding."
              : "Your account does not have a recorded acknowledgement."}
          </p>
        </div>
        <div className={styles.notice}>
          Sports analysis describes uncertainty. It does not guarantee an outcome or
          remove the risk of loss.
        </div>
        <Link className={styles.textLink} href="/responsible-play">
          Read the Responsible Play guidance
        </Link>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Account restrictions</h2>
          <p>
            Cooling-off and self-exclusion are unavailable because this account does not
            have the enforced restriction states those controls require.
          </p>
        </div>
      </section>
    </div>
  );
}
