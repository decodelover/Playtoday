import {
  EmptyState,
  FactList,
  MarketingSection,
  NumberedList,
  PageHero,
  SectionLead,
} from "../../public-shell/marketing";
import { metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("performance");

const publicationRules = [
  {
    title: "Use the exact published selection",
    body: "A result must trace back to the locked prediction, original observed odds, publication time, and applicable rule versions.",
  },
  {
    title: "Keep the denominator visible",
    body: "Reports need the time window, sample size, exclusions, void treatment, pass days, and missing-data treatment.",
  },
  {
    title: "Separate each kind of evidence",
    body: "Backtests, validation, shadow runs, simulations, and live production results cannot be blended into one number.",
  },
  {
    title: "Preserve losses and corrections",
    body: "Losing selections, voids, remaining-leg settlements, pass days, and later corrections must remain in the record.",
  },
] as const;

export default function Page() {
  return (
    <>
      <PageHero
        aside={
          <FactList
            items={[
              { label: "DB read model", value: "Not available" },
              { label: "Published records", value: "None" },
              { label: "Charts", value: "None fabricated" },
              { label: "Accuracy claim", value: "None" },
            ]}
          />
        }
        description="Verified reporting begins only when published predictions can be read from an approved database model and settled against real results."
        eyebrow="Verified performance"
        marker="P01"
        title="A performance record must come from published data."
        visual="archive"
      />

      <MarketingSection tone="paper" width="wide">
        <EmptyState title="No verified PlayToday performance records have been published yet.">
          <p>
            This repository has no approved performance read model, operational
            prediction service, or settlement dataset. The page therefore shows no
            sample fixtures, estimated returns, accuracy figures, or charts.
          </p>
        </EmptyState>
      </MarketingSection>

      <MarketingSection tone="ink" width="wide">
        <SectionLead
          marker="P02"
          eyebrow="Publication standard"
          title="What every future number must carry."
        />
        <NumberedList items={publicationRules} />
      </MarketingSection>
    </>
  );
}
