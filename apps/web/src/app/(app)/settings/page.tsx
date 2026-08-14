import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthenticatedAccountSettings } from "../../../lib/account-settings-service";
import styles from "./settings.module.css";

function initials(displayName: string | null, email: string | null) {
  const source = displayName?.trim() ?? email?.split("@")[0] ?? "P";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const groups = [
  {
    title: "Account",
    routes: [
      {
        href: "/settings/profile",
        label: "Profile",
        description: "Your display name, email identity and timezone.",
      },
      {
        href: "/settings/security",
        label: "Security",
        description: "Change your password and manage signed-in sessions.",
      },
    ],
  },
  {
    title: "Preferences",
    routes: [
      {
        href: "/settings/preferences",
        label: "Sports & analysis",
        description: "Bookmakers, markets, target odds and analysis style.",
      },
      {
        href: "/settings/notifications",
        label: "Notifications",
        description: "Choose the delivery channels PlayToday can currently save.",
      },
    ],
  },
  {
    title: "Safety & data",
    routes: [
      {
        href: "/settings/responsible-play",
        label: "Responsible Play",
        description: "Review your acknowledgement and available safety support.",
      },
      {
        href: "/settings/privacy",
        label: "Privacy & data",
        description: "See what is stored and download your account data.",
      },
    ],
  },
] as const;

export default async function SettingsPage() {
  const account = await getAuthenticatedAccountSettings();
  if (!account) {
    redirect("/sign-in");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>Settings</h1>
        <p>Manage the account and analysis preferences tied to your PlayToday login.</p>
      </header>

      <div className={styles.identityLine}>
        <span aria-hidden="true" className={styles.initials}>
          {initials(account.profile.display_name, account.user.email)}
        </span>
        <div>
          <strong>{account.profile.display_name ?? "Display name not set"}</strong>
          <span>{account.user.email ?? "Email unavailable"}</span>
        </div>
      </div>

      <div className={styles.settingsOverviewGrid}>
        {groups.map((group) => (
          <section className={styles.sectionGroup} key={group.title}>
            <h2>{group.title}</h2>
            <ul className={styles.routeList}>
              {group.routes.map((route) => (
                <li key={route.href}>
                  <Link className={styles.routeLink} href={route.href}>
                    <span>
                      <strong>{route.label}</strong>
                      <span>{route.description}</span>
                    </span>
                    <b aria-hidden="true">→</b>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
