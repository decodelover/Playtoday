import { redirect } from "next/navigation";

import { getAuthenticatedAccountSettings } from "../../../../lib/account-settings-service";
import styles from "../settings.module.css";
import { PasswordForm, SessionControls } from "./security-controls";

export default async function SecurityPage() {
  const account = await getAuthenticatedAccountSettings();
  if (!account) {
    redirect("/sign-in");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>Security</h1>
        <p>Manage the password and sessions attached to your account.</p>
      </header>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Email identity</h2>
          <p>
            Your email is read-only because a complete secure change flow is not
            enabled.
          </p>
        </div>
        <p className={styles.readOnlyValue}>
          {account.user.email ?? "Email unavailable"}
        </p>
      </section>

      <PasswordForm />
      <SessionControls />

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Multi-factor authentication</h2>
          <p>
            MFA is not offered in Settings because enrollment and login enforcement are
            not configured as one complete flow.
          </p>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Security activity</h2>
          <p>
            No account security activity history is available from a trusted source.
          </p>
        </div>
      </section>
    </div>
  );
}
