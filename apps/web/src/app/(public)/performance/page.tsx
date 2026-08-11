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
              { label: "Standard", value: "100% Data transparency" },
              { label: "Denominator", value: "Fully visible" },
              { label: "Pass days", value: "Log preserved" },
              { label: "Losses", value: "Never erased" },
            ]}
          />
        }
        description="Verified reporting tracks every published prediction against verified results with complete denominator visibility."
        eyebrow="Verified performance"
        marker="P01"
        title="A performance record must come from published data."
        visual="archive"
      />

      <MarketingSection tone="paper" width="wide">
        <EmptyState title="No settled PlayToday performance records are available yet.">
          <p>
            When published selections are settled against verified match outcomes, full
            historic logs, ROI summaries, sample sizes, and win distributions will
            display here.
          </p>
        </EmptyState>
      </MarketingSection>

      <MarketingSection tone="ink" width="wide">
        <SectionLead
          marker="P02"
          eyebrow="Publication standard"
          title="What every recorded number must carry."
        />
        <NumberedList items={publicationRules} />
      </MarketingSection>
    </>
  );
}
