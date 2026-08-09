import { LegalPageLayout } from "../../public-shell/marketing";
import { getPublicRoute, metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("terms");

export default function Page() {
  return (
    <LegalPageLayout route={getPublicRoute("terms")}>
      <p>
        <strong>[Pending Legal Review]</strong> These draft terms describe the current
        public information service. The legal operator, governing law, and dispute
        process have not been approved.
      </p>

      <h2>Information, not a betting service</h2>
      <p>
        PlayToday provides sports analysis and decision support. It is not a bookmaker,
        does not accept stakes or hold funds, and does not place bets or access
        bookmaker accounts for users.
      </p>

      <h2>No guaranteed outcome</h2>
      <p>
        Sports predictions are uncertain. A probability estimate, confidence measure,
        target-odds result, or written analysis does not guarantee a win or future
        performance.
      </p>

      <h2>Your responsibility</h2>
      <p>
        You are responsible for deciding whether to use the information and for any
        action you take outside PlayToday. You must be at least 18 years old, meet the
        legal age requirement where you live, and follow applicable local law.
      </p>

      <h2>Responsible use</h2>
      <p>
        Do not use PlayToday to chase losses or justify martingale staking. Higher odds
        carry higher risk, and a day with no qualifying selection is a valid outcome.
      </p>

      <h2>Current service limits</h2>
      <p>
        Account access, subscriptions, billing, live sports data, production
        predictions, and published performance records are not currently available. No
        checkout or payment contract is offered through this site.
      </p>

      <h2>Unresolved legal terms</h2>
      <p>
        The operator identity, intellectual-property terms, acceptable-use rules,
        limitation of liability, governing law, regional availability, and dispute
        process are [Pending Legal Review].
      </p>
    </LegalPageLayout>
  );
}
