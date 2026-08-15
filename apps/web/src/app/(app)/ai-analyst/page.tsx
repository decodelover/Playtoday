import { getAuthenticatedAccountSettings } from "../../../lib/account-settings-service";
import { AiAnalystClient } from "./ai-analyst-client";
import styles from "./ai-analyst.module.css";

export default async function AiAnalystPage() {
  const account = await getAuthenticatedAccountSettings();
  const userTimezone = account?.preferences.timezone ?? "UTC";

  return (
    <div className={styles.pageContainer}>
      <AiAnalystClient initialUserTimezone={userTimezone} />
    </div>
  );
}
