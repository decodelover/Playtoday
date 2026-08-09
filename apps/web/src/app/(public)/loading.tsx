import { Skeleton } from "@playtoday/ui";
import { MarketingSection } from "../public-shell/marketing";

export default function Loading() {
  return (
    <MarketingSection width="wide">
      <p role="status">Loading page</p>
      <Skeleton aria-hidden="true" style={{ height: "18rem" }} />
    </MarketingSection>
  );
}
