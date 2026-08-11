import { redirect } from "next/navigation";

import { getAuthenticatedAccountSettings } from "../../../../lib/account-settings-service";
import styles from "../settings.module.css";
import { NotificationsForm } from "./notifications-form";

export default async function NotificationSettingsPage() {
  const account = await getAuthenticatedAccountSettings();
  if (!account) {
    redirect("/sign-in");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>Notifications</h1>
        <p>Choose the delivery channels currently represented in your account.</p>
      </header>
      <NotificationsForm initial={account.preferences.notification_channels} />
    </div>
  );
}
