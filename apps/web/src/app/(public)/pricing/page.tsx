import {
  ContentGrid,
  ContentPanel,
  FactList,
  MarketingSection,
  PageHero,
  SectionLead,
  StatusNotice,
} from "../../public-shell/marketing";
import { metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("pricing");

const plans = ["Free", "Plus", "Pro", "Elite"] as const;

export default function Page() {
  return (
    <>
      <PageHero
        aside={
          <FactList
            items={[
              { label: "Plan names", value: "Free, Plus, Pro, Elite" },
              { label: "Prices", value: "Not finalized" },
              { label: "Checkout", value: "Unavailable" },
              { label: "Billing", value: "Not connected" },
            ]}
          />
        }
        description="The four plan names are set. Prices, entitlements, billing terms, and regional availability are still under review."
        eyebrow="Pricing"
        marker="PRC"
        title="Four planned tiers. No invented price tags."
        visual="stadium"
      />

      <MarketingSection tone="paper" width="wide">
        <SectionLead
          marker="PR1"
          eyebrow="Planned tiers"
          title="Pricing has not been finalized."
        />
        <ContentGrid columns="four">
          {plans.map((plan) => (
            <ContentPanel key={plan} label="Planned plan" title={plan}>
              <p>
                Pricing has not been finalized. Features, limits, trials, and regional
                availability have not been approved for this tier.
              </p>
            </ContentPanel>
          ))}
        </ContentGrid>
      </MarketingSection>

      <MarketingSection tone="ink" width="wide">
        <StatusNotice label="Subscription access" value="Not on sale">
          <p>
            PlayToday does not have a checkout, payment provider, active subscription,
            renewal flow, or cancellation process. No payment can be made on this site.
          </p>
        </StatusNotice>
      </MarketingSection>
    </>
  );
}
