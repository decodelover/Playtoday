import Image from "next/image";

import {
  ActionLink,
  FactList,
  MarketingSection,
  NumberedList,
  PageHero,
  SectionLead,
  StatusNotice,
} from "../../../app/public-shell/marketing";

import { FoundationCarousel } from "./foundation-carousel";
import styles from "./home.module.css";

const evidenceTerms = [
  {
    key: "Probability",
    title: "Estimated probability",
    body: "A model estimate for a defined outcome. It needs calibration, a clear prediction time, and honest precision.",
  },
  {
    key: "Confidence",
    title: "Model confidence",
    body: "A measure of how strongly the model supports its own estimate. It is not the same thing as the chance of winning.",
  },
  {
    key: "Quality",
    title: "Data quality",
    body: "A diagnostic built from completeness, freshness, consistency, identifier confidence, and sample adequacy.",
  },
  {
    key: "Source",
    title: "Source and time",
    body: "The provider, observation time, and freshness window needed to judge whether the evidence still holds.",
  },
] as const;

const productQuestions = [
  {
    title: "Which fixtures deserve attention?",
    body: "Supported football fixtures pass identity, freshness, competition, feature, and market checks before analysis begins.",
  },
  {
    title: "Can a target be reached without weakening the evidence?",
    body: "A target-odds request may return a lower total or no combination. The system does not add a weak leg just to reach a number.",
  },
  {
    title: "What changed the result?",
    body: "Published tickets keep every leg visible, identify the selection that cut the ticket, and continue settling remaining legs.",
  },
] as const;

const workflow = [
  {
    title: "Ingest licensed football data",
    body: "Provider payloads map into canonical fixtures, teams, markets, odds observations, and provenance records.",
  },
  {
    title: "Check eligibility before prediction",
    body: "Stale, incomplete, conflicting, unsupported, or suspicious inputs are excluded or sent for review.",
  },
  {
    title: "Estimate and calibrate probability",
    body: "Statistical models produce the estimate. The system cannot invent a fixture, score, price, injury, lineup, or probability.",
  },
  {
    title: "Build only eligible combinations",
    body: "Candidate legs are checked for evidence quality and dependency risk. The target never outranks those checks.",
  },
  {
    title: "Lock the published record",
    body: "The prediction, observed odds, model version, rules, and publication time remain attached to the original decision.",
  },
  {
    title: "Settle every leg",
    body: "Versioned rules apply verified results. Wins, losses, voids, corrections, and pass days stay in the record.",
  },
] as const;

const questions = [
  {
    q: "How does PlayToday analyze matches?",
    a: "PlayToday evaluates historical match statistics, team form metrics, and calibrated probability models to generate evidence-backed decision support.",
  },
  {
    q: "Does a target guarantee a suitable ticket?",
    a: "No. A request returns a lower total or no qualifying combination when evidence is insufficient.",
  },
  {
    q: "Will a selection appear every day?",
    a: "Not necessarily. A pass day is the correct result when no candidate clears publication rules.",
  },
  {
    q: "Can PlayToday place a bet?",
    a: "No. PlayToday is an analytical platform. It does not accept stakes, hold funds, access bookmaker accounts, or place bets.",
  },
] as const;

export function HomeHero() {
  return (
    <PageHero
      actions={
        <>
          <ActionLink href="/how-it-works" primary>
            Read the method
          </ActionLink>
          <ActionLink href="/performance">Performance standard</ActionLink>
        </>
      }
      aside={
        <FactList
          items={[
            { label: "Sport", value: "Football" },
            { label: "Match stage", value: "Pre-match" },
            { label: "Method", value: "Statistical analysis" },
            { label: "Standard", value: "Transparent records" },
          ]}
        />
      }
      description="PlayToday makes sports analysis easier to inspect, question, and verify. Access probability estimates, target-odds decision support, and a complete record of every published result."
      eyebrow="Football intelligence"
      marker="01"
      title="Football analysis that shows its work."
    />
  );
}

export function EngineeringFoundation() {
  return (
    <section
      aria-labelledby="engineering-foundation-title"
      className={styles.foundation}
      data-reveal="fade"
      data-stagger
      suppressHydrationWarning
    >
      <div className={styles.foundationHeading}>
        <p>Sports Data & Media Ecosystem</p>
        <h2 id="engineering-foundation-title">
          Built for speed, accuracy, and reliability.
        </h2>
      </div>
      <FoundationCarousel />
      <p className={styles.foundationNote}>
        Real-time odds feeds, live match telemetry, and global league data processing.
      </p>
    </section>
  );
}

export function ValueAndCoverage() {
  return (
    <MarketingSection tone="paper" width="wide">
      <SectionLead
        description="A percentage without its source, timing, and limits is easy to misread. PlayToday keeps the parts separate so you can judge what the number means."
        eyebrow="Read the evidence"
        marker="02"
        title="The number is never the whole story."
      />
      <figure className={styles.sectionVisual} data-crop="evidence" data-motion-media>
        <Image
          alt="A conceptual football evidence-review desk with a blank pitch diagram, translucent tactical sheets, and an unbranded ball"
          fill
          sizes="(max-width: 768px) calc(100vw - 2rem), 1216px"
          src="/images/playtoday-evidence-review.png"
        />
        <figcaption>Tactical evidence and model review interface.</figcaption>
      </figure>
      <div className={styles.evidenceGrid} data-stagger>
        {evidenceTerms.map((item) => (
          <article className={styles.evidenceItem} key={item.key}>
            <span>{item.key}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </MarketingSection>
  );
}

export function FeatureLaboratory() {
  return (
    <MarketingSection tone="ink" width="wide">
      <SectionLead
        description="PlayToday sports analysis starts with a small set of hard questions. Each answer is traceable to licensed data and published rules."
        eyebrow="Product scope"
        marker="03"
        title="Built around decisions, not tips."
      />
      <div className={styles.questionList} data-stagger>
        {productQuestions.map((item, index) => (
          <article key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <div className={styles.scopeNote}>
        <p>Current coverage</p>
        <strong>Football, pre-match analysis.</strong>
        <p>
          In-play tracking and additional sports follow pre-match football coverage.
        </p>
      </div>
    </MarketingSection>
  );
}

export function Workflow() {
  return (
    <MarketingSection tone="signal" width="wide">
      <SectionLead
        description="Every stage leaves enough evidence to reconstruct what the system knew, what it excluded, and why it published or passed."
        eyebrow="Method"
        marker="04"
        title="A decision trail from source to settlement."
      />
      <figure className={styles.sectionVisual} data-crop="pipeline" data-motion-media>
        <Image
          alt="A conceptual sequence of six physical checkpoints carrying one light path from a football stadium to a sealed archive"
          fill
          sizes="(max-width: 768px) calc(100vw - 2rem), 1216px"
          src="/images/playtoday-data-pipeline.png"
        />
        <figcaption>
          Six-stage decision pipeline from data ingestion to verified settlement.
        </figcaption>
      </figure>
      <NumberedList items={workflow} />
    </MarketingSection>
  );
}

export function Transparency() {
  return (
    <MarketingSection tone="paper" width="wide">
      <SectionLead
        description="Every published selection remains permanently recorded alongside its result, odds, model version, and settlement details."
        eyebrow="Performance"
        marker="05"
        title="A loss belongs in the record."
      />
      <figure className={styles.sectionVisual} data-crop="archive" data-motion-media>
        <Image
          alt="A conceptual football records archive with blank ledgers, unlabeled folders, and a worn unbranded ball"
          fill
          sizes="(max-width: 768px) calc(100vw - 2rem), 1216px"
          src="/images/playtoday-results-archive.png"
        />
        <figcaption>
          Permanent published selection archive and settlement log.
        </figcaption>
      </figure>
      <StatusNotice label="Performance tracking" value="Active logging">
        <p>
          Verified performance records track every published selection, observed odds,
          sample size, model version, void adjustment, and settlement outcome.
        </p>
        <p>
          When records exist, they include the exact selection, observed odds, model
          version, void handling, corrections, and every losing result.
        </p>
        <ActionLink href="/performance">Read the publication standard</ActionLink>
      </StatusNotice>
    </MarketingSection>
  );
}

export function TrustPlansFaq() {
  return (
    <>
      <MarketingSection width="wide">
        <div className={styles.responsibilityGrid}>
          <div>
            <p className={styles.inlineMarker}>06 / Responsible play</p>
            <h2>Useful information can still lead to a losing choice.</h2>
          </div>
          <div>
            <p>
              PlayToday cannot remove uncertainty. Use analysis within a fixed budget,
              take pass days seriously, and never increase a stake to recover a loss.
            </p>
            <ActionLink href="/responsible-play">
              Read the responsible-play principles
            </ActionLink>
          </div>
        </div>
      </MarketingSection>
      <MarketingSection tone="ink" width="wide">
        <SectionLead
          description="Direct answers regarding sports intelligence, target odds, and system capabilities."
          eyebrow="Platform FAQ"
          marker="07"
          title="Frequently asked questions."
        />
        <div className={styles.qaList} data-stagger>
          {questions.map((item) => (
            <article key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
        <div className={styles.compatibilityLine}>
          <span>Market mapping compatibility</span>
          <p>SportyBet / Bet9ja / MSport</p>
          <small>Compatibility indicates selection market structure mapping.</small>
        </div>
      </MarketingSection>
    </>
  );
}
