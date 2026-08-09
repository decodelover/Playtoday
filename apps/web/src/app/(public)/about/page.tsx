import {
  ActionLink,
  ContentGrid,
  ContentPanel,
  FactList,
  MarketingSection,
  PageHero,
  SectionLead,
} from "../../public-shell/marketing";
import { metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("about");

export default function Page() {
  return (
    <>
      <PageHero
        actions={
          <ActionLink href="/how-it-works" primary>
            See the method
          </ActionLink>
        }
        aside={
          <FactList
            items={[
              { label: "Purpose", value: "Sports intelligence" },
              { label: "Initial scope", value: "Pre-match football" },
              { label: "Method", value: "Statistical analysis" },
              { label: "Standard", value: "Transparent records" },
            ]}
          />
        }
        description="PlayToday is being built to make sports analysis easier to inspect, question, and verify."
        eyebrow="About PlayToday"
        marker="A01"
        title="Show the evidence, the uncertainty, and the result."
        visual="analysis"
      />

      <MarketingSection tone="paper" width="wide">
        <SectionLead
          marker="A02"
          eyebrow="Mission"
          title="A clearer record of how a selection was made."
        />
        <ContentGrid>
          <ContentPanel title="Transparency before promotion">
            <p>
              Published records should include losses, pass days, exclusions, voids, and
              corrections alongside successful results.
            </p>
          </ContentPanel>
          <ContentPanel title="Statistical analysis with limits">
            <p>
              Models estimate probability from available evidence. They do not remove
              uncertainty, guarantee an outcome, or justify a weak selection.
            </p>
          </ContentPanel>
          <ContentPanel title="A target that can be refused">
            <p>
              Requested odds do not override evidence quality. PlayToday can return a
              lower total or no selection when the available candidates do not qualify.
            </p>
          </ContentPanel>
          <ContentPanel title="A result that remains traceable">
            <p>
              Predictions, odds, model versions, settlement rules, and corrections need
              records that can be reconstructed after publication.
            </p>
          </ContentPanel>
        </ContentGrid>
      </MarketingSection>

      <MarketingSection tone="signal" width="wide">
        <SectionLead
          description="PlayToday does not place bets, hold funds, access bookmaker accounts, or claim that an estimate will win."
          marker="A03"
          eyebrow="Product boundary"
          title="Analysis, not wagering."
        />
      </MarketingSection>
    </>
  );
}
