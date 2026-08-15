import React from "react";
import { getAuthenticatedAccountSettings } from "../../../lib/account-settings-service";
import { getDailyEdgeForDate, getDailyEdgeHistory } from "../../../lib/daily-edge-service";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import { DailyEdgeClient } from "./daily-edge-client";

export default async function DailyEdgePage() {
  const route = getShellRoute("daily-edge");
  const account = await getAuthenticatedAccountSettings();
  const timezone = account?.preferences.timezone ?? "UTC";

  const todayIso = new Date().toISOString().split("T")[0]!;
  const [todayPublication, history] = await Promise.all([
    getDailyEdgeForDate(todayIso),
    getDailyEdgeHistory(30),
  ]);

  const badgeText =
    todayPublication?.status === "published"
      ? `${todayPublication.originalCombinedOdds?.toFixed(2)}X PUBLISHED`
      : todayPublication?.status === "pass_day"
      ? "PASS DAY"
      : "EVALUATING";

  return (
    <WorkspacePageWrapper
      badgeText={badgeText}
      route={route}
      subtitle="Curated daily football intelligence targeting ~2.00 combined decimal odds. Governed by disciplined statistical models with strict pass-day architecture."
    >
      <DailyEdgeClient
        history={history}
        todayPublication={todayPublication}
        userTimezone={timezone}
      />
    </WorkspacePageWrapper>
  );
}
