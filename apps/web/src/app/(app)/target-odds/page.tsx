import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import { TargetOddsClient } from "./target-odds-client";

export default function TargetOddsPage() {
  const route = getShellRoute("target-odds");

  return (
    <WorkspacePageWrapper
      badgeText="OPTIMIZER ENGINE ACTIVE"
      route={route}
      subtitle="Construct mathematically-balanced accumulators and ticket combinations from live verified market odds."
    >
      <TargetOddsClient />
    </WorkspacePageWrapper>
  );
}
