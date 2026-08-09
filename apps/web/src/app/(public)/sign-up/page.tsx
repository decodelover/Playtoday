import {
  ActionLink,
  FactList,
  MarketingSection,
  PageHero,
  StatusNotice,
} from "../../public-shell/marketing";
import { metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("sign-up");

export default function Page() {
  return (
    <>
      <PageHero
        aside={
          <FactList
            items={[
              { label: "Registration", value: "Closed" },
              { label: "Waitlist", value: "Not available" },
              { label: "Launch date", value: "Not published" },
            ]}
          />
        }
        description="There is no registration or waitlist flow. Until account access exists, the useful place to start is the product method and its limits."
        eyebrow="Get started"
        marker="ID1"
        title="Start with the method, not a form."
      />
      <MarketingSection tone="signal" width="wide">
        <StatusNotice label="Registration status" value="Not open">
          <p>No account, subscription, or trial can be created from this route.</p>
          <ActionLink href="/how-it-works">Read how PlayToday is designed</ActionLink>
        </StatusNotice>
      </MarketingSection>
    </>
  );
}
