import { redirect } from "next/navigation";

import { getAuthenticatedAccountSettings } from "../../../../lib/account-settings-service";
import styles from "../settings.module.css";
import { ProfileForm } from "./profile-form";
import { AvatarUploader } from "./avatar-uploader";

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
        <p>Keep your account identity, profile photo, and local time display up to date.</p>
      </header>

      <AvatarUploader
        currentAvatarUrl={account.profile.avatar_url}
        displayName={account.profile.display_name}
      />

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
    </div>
  );
}
