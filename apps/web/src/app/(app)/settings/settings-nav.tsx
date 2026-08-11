"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./settings.module.css";

const settingsRoutes = [
  { href: "/settings", label: "Overview", exact: true },
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/preferences", label: "Preferences" },
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/security", label: "Security" },
  { href: "/settings/responsible-play", label: "Responsible Play" },
  { href: "/settings/privacy", label: "Privacy & Data" },
] as const;

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Settings" className={styles.settingsNav}>
      {settingsRoutes.map((route) => {
        const active =
          "exact" in route && route.exact
            ? pathname === route.href
            : pathname.startsWith(route.href);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            data-active={active || undefined}
            href={route.href}
            key={route.href}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
