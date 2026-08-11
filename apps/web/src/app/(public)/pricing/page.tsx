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

const planDetails = [
  {
    name: "Free",
    label: "Basic tier",
    description:
      "Access basic match probabilities, standard model confidence scores, and published performance summaries.",
  },
  {
    name: "Plus",
    label: "Analyst tier",
    description:
      "Unlocks target-odds selection tools, detailed data quality ratings, and custom match filter criteria.",
  },
  {
    name: "Pro",
    label: "Professional tier",
    description:
      "Unlocks AI Analyst match breakdowns, Daily Edge notifications, and complete settlement history archives.",
  },
  {
    name: "Elite",
    label: "Institutional tier",
    description:
      "Unlocks multi-market combination modeling, priority API access, and advanced export capabilities.",
  },
] as const;

export default function Page() {
  return (
    <>
      <PageHero
        aside={
          <FactList
            items={[
              { label: "Plans", value: "Free, Plus, Pro, Elite" },
              { label: "Billing", value: "Subscription" },
              { label: "Target odds", value: "Included in Plus+" },
              { label: "AI Analyst", value: "Included in Pro+" },
            ]}
          />
        }
        description="Explore PlayToday plans tailored for analysts, casual observers, and serious sports bettors."
        eyebrow="Pricing & Plans"
        marker="PRC"
        title="Transparent plan structure. Built for every analyst."
        visual="stadium"
      />

      <MarketingSection tone="paper" width="wide">
        <SectionLead
          marker="PR1"
          eyebrow="Plan tiers"
          title="Choose the depth of analysis you need."
        />
        <ContentGrid columns="four">
          {planDetails.map((plan) => (
            <ContentPanel key={plan.name} label={plan.label} title={plan.name}>
              <p>{plan.description}</p>
            </ContentPanel>
          ))}
        </ContentGrid>
      </MarketingSection>

      <MarketingSection tone="ink" width="wide">
        <StatusNotice label="Subscription access" value="Rolling availability">
          <p>
            Plan pricing details and online subscription checkout will open prior to
            full plan rollout. All registered users start with access to the Free tier
            features upon account activation.
          </p>
        </StatusNotice>
      </MarketingSection>
    </>
  );
}
