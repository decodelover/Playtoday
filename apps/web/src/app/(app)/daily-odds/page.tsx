import { PagePlaceholder } from "../../app-shell/page-placeholder";
import { getShellRoute } from "../../app-shell/routes";
export default function Page() {
  return <PagePlaceholder route={getShellRoute("daily-odds")} />;
}
