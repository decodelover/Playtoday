import { LegalPageLayout } from "../../public-shell/marketing";
import { getPublicRoute, metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("terms");

export default function Page() {
  return (
    <LegalPageLayout route={getPublicRoute("terms")}>
      <p>
        These Terms of Use govern your access to and use of the PlayToday sports
        intelligence service. By accessing or using PlayToday, you agree to comply with
        these terms.
      </p>

      <h2>Information & decision support, not a bookmaker</h2>
      <p>
        PlayToday provides sports analysis, probability estimation, and decision
        support. PlayToday is not a bookmaker, does not accept wagers, does not hold
        customer funds, and does not place bets or access bookmaker accounts on behalf
        of users.
      </p>

      <h2>No outcome guarantees</h2>
      <p>
        Sports events are inherently uncertain. Probability estimates, model confidence
        metrics, target-odds calculations, and written match breakdowns do not guarantee
        winning outcomes or future financial performance.
      </p>

      <h2>User eligibility & responsibilities</h2>
      <p>
        You must be at least 18 years old and of legal age to view sports statistics and
        gambling-related content in your jurisdiction. You are solely responsible for
        evaluating sports information before placing any wagers with licensed bookmakers
        outside PlayToday.
      </p>

      <h2>Responsible play compliance</h2>
      <p>
        PlayToday promotes responsible play principles. Users agree not to use platform
        insights for loss-chasing or martingale staking strategies. High-odds
        combinations carry inherently lower probabilities of success.
      </p>

      <h2>Service availability & intellectual property</h2>
      <p>
        All proprietary analysis algorithms, probability models, visual design assets,
        and content on PlayToday are protected by intellectual property laws. PlayToday
        reserves the right to modify, suspend, or update service features to maintain
        data quality and security standards.
      </p>
    </LegalPageLayout>
  );
}
