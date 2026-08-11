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
              { label: "Submission", value: "Securely processed" },
              { label: "Validation", value: "Server-side checked" },
              { label: "Storage", value: "Encrypted log" },
              { label: "Support", value: "Direct review" },
            ]}
          />
        }
        description="Send a message regarding products, data quality, responsible play, privacy, or general inquiries."
        eyebrow="Contact Us"
        marker="C01"
        title="Get in touch with our team."
        visual="evidence"
      />
      <MarketingSection tone="paper" width="wide">
        <ContactForm />
      </MarketingSection>
    </>
  );
}
