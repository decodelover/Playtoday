import {
  ContentGrid,
  ContentPanel,
  FactList,
  MarketingSection,
  NumberedList,
  PageHero,
  SectionLead,
  StatusNotice,
} from "../../public-shell/marketing";
import { metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("responsible-play");

const principles = [
  {
    title: "Set a fixed limit before you start",
    body: "Decide what you can afford to lose before looking at a match. Do not raise that limit because an analysis appears confident.",
  },
  {
    title: "Treat higher odds as higher risk",
    body: "A larger potential return comes with a lower chance of success. Combining selections increases the number of ways a ticket can lose.",
  },
  {
    title: "Do not use martingale staking",
    body: "Increasing the next stake after a loss can turn a short losing run into a much larger loss. PlayToday does not recommend this approach.",
  },
  {
    title: "Never chase a loss",
    body: "Do not increase a stake, add more selections, or abandon your limit to recover money already lost.",
  },
  {
    title: "Accept days with no selection",
    body: "No qualifying selection is a valid result. A target should never pressure you into accepting weaker evidence.",
  },
  {
    title: "Stop when play affects daily life",
    body: "Step away if betting affects money needed for essentials, sleep, work, relationships, or your ability to make calm choices.",
  },
] as const;

export default function Page() {
  return (
    <>
      <PageHero
        aside={
          <FactList
            items={[
              { label: "Minimum age", value: "18+" },
              { label: "Higher odds", value: "Higher risk" },
              { label: "Martingale", value: "Not recommended" },
              { label: "Loss chasing", value: "Never" },
            ]}
          />
        }
        description="Sports analysis cannot make an uncertain event certain or make a loss affordable."
        eyebrow="Responsible play"
        marker="R01"
        title="Set the limit before the match begins."
        visual="evidence"
      />

      <MarketingSection tone="signal" width="wide">
        <StatusNotice label="Eligibility" value="Adults only">
          <p>
            You must be at least 18 years old and meet the legal age requirement where
            you live. PlayToday is information and decision support. It is not a
            bookmaker, wallet, bet-placement service, or guarantee.
          </p>
        </StatusNotice>
      </MarketingSection>

      <MarketingSection tone="paper" width="wide">
        <SectionLead
          marker="R02"
          eyebrow="Personal limits"
          title="Rules to decide before money is at risk."
        />
        <NumberedList items={principles} />
      </MarketingSection>

      <MarketingSection tone="ink" width="wide">
        <SectionLead
          marker="R03"
          eyebrow="Risk check"
          title="Pause when the decision stops feeling calm."
        />
        <ContentGrid>
          <ContentPanel title="A model can be wrong.">
            <p>
              Probability, model confidence, and data quality answer different
              questions. None of them guarantees a winning result.
            </p>
          </ContentPanel>
          <ContentPanel title="A loss does not create a recovery opportunity.">
            <p>
              Each new stake carries its own risk. Previous losses are not evidence that
              the next selection will win.
            </p>
          </ContentPanel>
        </ContentGrid>
      </MarketingSection>
    </>
  );
}
