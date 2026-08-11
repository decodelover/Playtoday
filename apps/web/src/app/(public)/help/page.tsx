import { HelpSearch } from "../../../components/public/help/help-search";
import { FactList, MarketingSection, PageHero } from "../../public-shell/marketing";
import { metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("help");

export default function Page() {
  return (
    <>
      <PageHero
        aside={
          <FactList
            items={[
              { label: "Answers", value: "Verified Knowledgebase" },
              { label: "Search", value: "Instant client search" },
              { label: "Method", value: "Documented standards" },
              { label: "Scope", value: "Product & analysis" },
            ]}
          />
        }
        description="Search published articles regarding sports intelligence, probability calibration, target odds, Daily Edge, and settlement rules."
        eyebrow="Help Centre"
        marker="H01"
        title="Direct answers to common questions."
        visual="pipeline"
      />
      <MarketingSection tone="paper" width="wide">
        <HelpSearch />
      </MarketingSection>
    </>
  );
}
