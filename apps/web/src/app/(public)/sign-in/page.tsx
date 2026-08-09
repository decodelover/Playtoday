import {
  ActionLink,
  FactList,
  MarketingSection,
  PageHero,
  StatusNotice,
} from "../../public-shell/marketing";
import { metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("sign-in");

export default function Page() {
  return (
    <>
      <PageHero
        aside={
          <FactList
            items={[
              { label: "Account access", value: "Closed" },
              { label: "Credential form", value: "Not available" },
              { label: "Authentication", value: "Not active" },
            ]}
          />
        }
        description="Authentication has not been introduced. There is no safe place to enter an email address, password, or account credential on this site."
        eyebrow="Account access"
        marker="ID0"
        title="Accounts are not open yet."
      />
      <MarketingSection tone="paper" width="wide">
        <StatusNotice label="Sign-in status" value="Unavailable">
          <p>
            No account can be accessed from this route. The page deliberately contains
            no imitation sign-in form.
          </p>
          <ActionLink href="/">Return home</ActionLink>
        </StatusNotice>
      </MarketingSection>
    </>
  );
}
