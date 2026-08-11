import Link from "next/link";

import settingsStyles from "../settings/settings.module.css";

export default function SubscriptionPage() {
  return (
    <div className={settingsStyles.page}>
      <header className={settingsStyles.pageHeader}>
        <h1>Subscription</h1>
        <p>PlayToday does not currently have billing or subscription records.</p>
      </header>
      <section className={settingsStyles.panel}>
        <div className={settingsStyles.panelHeader}>
          <h2>No billing profile</h2>
          <p>
            There is no active plan, renewal date, payment method or billing history to
            show for this account.
          </p>
        </div>
        <Link className={settingsStyles.textLink} href="/pricing">
          View published plan information
        </Link>
      </section>
    </div>
  );
}
