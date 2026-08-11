import { redirect } from "next/navigation";

import { getAuthenticatedAccountSettings } from "../../../../lib/account-settings-service";
import styles from "../settings.module.css";
import { PreferencesForm } from "./preferences-form";

export default async function PreferencesPage() {
  const account = await getAuthenticatedAccountSettings();
  if (!account) {
    redirect("/sign-in");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>Sports & analysis</h1>
        <p>
          These are the same preferences you chose during onboarding. Changes apply
          wherever PlayToday reads your account settings.
        </p>
      </header>
      <PreferencesForm initial={account.preferences} />
    </div>
  );
}
