import { redirect } from "next/navigation";

import { getAuthenticatedAccountSettings } from "../../../../lib/account-settings-service";
import styles from "../settings.module.css";
import { ProfileForm } from "./profile-form";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default async function ProfilePage() {
  const account = await getAuthenticatedAccountSettings();
  if (!account) {
    redirect("/sign-in");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>Profile</h1>
        <p>Keep your account identity and local time display up to date.</p>
      </header>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Account identity</h2>
          <p>
            Your email comes from the authenticated account and cannot be changed here.
          </p>
        </div>
        <dl className={styles.dataList}>
          <dt>Email</dt>
          <dd>{account.user.email ?? "Email unavailable"}</dd>
          <dt>Email status</dt>
          <dd>{account.user.emailConfirmedAt ? "Verified" : "Not verified"}</dd>
          <dt>Account created</dt>
          <dd>{formatDate(account.user.createdAt)}</dd>
        </dl>
      </section>

      <ProfileForm
        displayName={account.profile.display_name}
        timezone={account.preferences.timezone}
      />

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Profile image</h2>
          <p>
            PlayToday does not have account image uploads. Your initials are used
            instead, so no stock image or unverified avatar is shown.
          </p>
        </div>
      </section>
    </div>
  );
}
