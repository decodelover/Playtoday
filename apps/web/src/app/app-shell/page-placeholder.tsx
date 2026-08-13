import type { ShellRoute } from "./routes";
import { WorkspacePageWrapper } from "./workspace-page-wrapper";

export function PagePlaceholder({ route }: Readonly<{ route: ShellRoute }>) {
  return <WorkspacePageWrapper route={route} />;
}
