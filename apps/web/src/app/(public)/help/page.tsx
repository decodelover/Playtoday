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
              { label: "Answers", value: "Published PlayToday content" },
              { label: "Search", value: "Local Help Centre only" },
              { label: "AI chatbot", value: "Not used" },
              { label: "Live support", value: "Unavailable" },
            ]}
          />
        }
        description="Search direct answers about the product, its current limits, target odds, Daily Edge, and settlement."
        eyebrow="Help Centre"
        marker="H01"
        title="Find the answer that is actually published."
        visual="pipeline"
      />
      <MarketingSection tone="paper" width="wide">
        <HelpSearch />
      </MarketingSection>
    </>
  );
}
