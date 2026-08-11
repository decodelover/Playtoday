import type { ReactNode } from "react";

import styles from "./settings.module.css";
import { SettingsNav } from "./settings-nav";

export default function SettingsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className={styles.settingsShell}>
      <SettingsNav />
      <div className={styles.settingsContent}>{children}</div>
    </div>
  );
}
