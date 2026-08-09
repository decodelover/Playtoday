import {
  ActionLink,
  ContentGrid,
  ContentPanel,
  FactList,
  MarketingSection,
  NumberedList,
  PageHero,
  SectionLead,
} from "../../public-shell/marketing";
import { metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("how-it-works");

const stages = [
  {
    title: "Validate the source data",
    body: "Provider records are mapped to canonical fixtures, teams, competitions, markets, odds observations, and source identifiers before analysis begins.",
  },
  {
    title: "Reject weak inputs",
    body: "A fixture can be excluded for stale status, unresolved identity, inadequate history, unsupported markets, conflicting sources, suspicious odds, or missing features.",
  },
  {
    title: "Estimate the outcome",
    body: "Statistical and machine-learning models produce probabilities. Calibration, coverage, prediction time, and uncertainty stay attached to each estimate.",
  },
  {
    title: "Check the target odds",
    body: "The requested target is a constraint, not an instruction to force a selection. The system can return a lower total or no qualifying selection.",
  },
  {
    title: "Keep the published decision",
    body: "A published prediction retains its original odds, input references, model version, calibration version, rule version, and publication time.",
  },
  {
    title: "Settle from verified results",
    body: "Versioned rules settle each leg. Ambiguous or corrected provider data enters review instead of being guessed.",
  },
] as const;

export default function Page() {
  return (
    <>
      <PageHero
        actions={
          <ActionLink href="/performance" primary>
            Performance standard
          </ActionLink>
        }
        aside={
          <FactList
            items={[
              { label: "Data", value: "Validated before use" },
              { label: "AI Analyst", value: "Explains verified output" },
              { label: "Target odds", value: "A constraint, not a promise" },
              { label: "Settlement", value: "Versioned and reviewable" },
            ]}
          />
        }
        description="PlayToday checks the evidence first. A requested target never overrides weak or missing data."
        eyebrow="How it works"
        marker="M01"
        title="A decision you can trace from source to settlement."
        visual="pipeline"
      />

      <MarketingSection tone="paper" width="wide">
        <SectionLead
          eyebrow="Decision path"
          marker="M02"
          title="Every published selection follows the same checks."
        />
        <NumberedList items={stages} />
      </MarketingSection>

      <MarketingSection tone="ink" width="wide">
        <SectionLead
          marker="M03"
          eyebrow="Clear boundaries"
          title="What each part is allowed to do."
        />
        <ContentGrid>
          <ContentPanel label="Sports data" title="Facts come from approved sources.">
            <p>
              A language model cannot invent a fixture, score, market, price, or result.
              Missing facts remain missing.
            </p>
          </ContentPanel>
          <ContentPanel label="AI Analyst" title="Explanation follows the evidence.">
            <p>
              The AI Analyst can summarize structured output and explain why a candidate
              passed or failed. It does not create the underlying sports record.
            </p>
          </ContentPanel>
          <ContentPanel label="Target odds" title="A target can be missed.">
            <p>
              If the available evidence cannot support the requested total, PlayToday
              can return a lower total or no selection.
            </p>
          </ContentPanel>
          <ContentPanel label="Settlement" title="Corrections remain visible.">
            <p>
              Settlement uses the published record and the applicable rule version.
              Later corrections do not erase the original decision trail.
            </p>
          </ContentPanel>
        </ContentGrid>
      </MarketingSection>

      <MarketingSection tone="signal" width="wide">
        <SectionLead
          description="Even a well-supported estimate can lose. The responsible-play guidance explains how to keep that uncertainty in view."
          eyebrow="Use the analysis carefully"
          marker="M04"
          title="Evidence improves a decision. It does not guarantee an outcome."
        />
        <ActionLink href="/responsible-play">Responsible-play guidance</ActionLink>
      </MarketingSection>
    </>
  );
}
