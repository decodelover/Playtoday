import { getAuthenticatedAccountSettings } from "../../../lib/account-settings-service";
import { getTodaysGames } from "../../../lib/games-service";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import { GamesClient } from "./games-client";

export default async function GamesPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ date?: string }> }>) {
  const route = getShellRoute("games");
  const params = await searchParams;
  const selectedDate = /^\d{4}-\d{2}-\d{2}$/u.test(params.date ?? "")
    ? params.date
    : undefined;

  // Fetch account user timezone preference (default "UTC" or "Africa/Lagos")
  const account = await getAuthenticatedAccountSettings();
  const userTimezone = account?.preferences.timezone ?? "UTC";

  // Query canonical Today's Games read model
  const todaysGamesData = await getTodaysGames({
    userTimezone,
    ...(selectedDate ? { dateIso: selectedDate } : {}),
  });

  return (
    <WorkspacePageWrapper
      badgeText={
        todaysGamesData.fixtures.length > 0
          ? `${todaysGamesData.totalCount} FOOTBALL FIXTURES`
          : "TODAY'S FOOTBALL"
      }
      route={route}
      subtitle="Follow scheduled, live, and finished football fixtures in your local time."
    >
      <GamesClient initialData={todaysGamesData} />
    </WorkspacePageWrapper>
  );
}
