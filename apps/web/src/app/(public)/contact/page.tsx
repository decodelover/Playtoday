import { ContactForm } from "../../../components/public/contact/contact-form";
import { FactList, MarketingSection, PageHero } from "../../public-shell/marketing";
import { metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("contact");

export default function Page() {
  return (
    <>
      <PageHero
        aside={
          <FactList
            items={[
              { label: "Submission", value: "Stored only after confirmation" },
              { label: "Fields", value: "Validated on the server" },
              { label: "Sensitive data", value: "Do not include it" },
              { label: "Response time", value: "Not promised" },
            ]}
          />
        }
        description="Use the form for product, data, responsible-play, privacy, or general questions."
        eyebrow="Contact"
        marker="C01"
        title="Send a message that is either saved or clearly refused."
        visual="evidence"
      />
      <MarketingSection tone="paper" width="wide">
        <ContactForm />
      </MarketingSection>
    </>
  );
}
