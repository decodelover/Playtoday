import { LegalPageLayout } from "../../public-shell/marketing";
import { getPublicRoute, metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("privacy");

export default function Page() {
  return (
    <LegalPageLayout route={getPublicRoute("privacy")}>
      <p>
        PlayToday is committed to protecting your privacy. This policy outlines how
        personal data, submission records, and technical analytics are collected,
        stored, and processed across our sports intelligence platform.
      </p>

      <h2>Information submitted through the contact form</h2>
      <p>
        When you submit an inquiry through our contact form, we collect your inquiry
        category, name, email address, subject, and message body. PlayToday uses this
        information solely to review, respond to, and process your request.
      </p>

      <h2>Data storage and security</h2>
      <p>
        Contact form submissions are stored in an encrypted database infrastructure.
        Access is restricted to authorized server-side processing and support
        administration. Submitted information is never sold or shared with third-party
        advertisers.
      </p>

      <h2>Technical & usage data</h2>
      <p>
        We process standard web operational logs, IP addresses, browser user-agent
        strings, and security event metadata to protect service integrity, prevent
        abuse, and enforce rate limits.
      </p>

      <h2>Data retention and rights</h2>
      <p>
        We retain contact submissions for as long as necessary to address your request
        and satisfy operational and security requirements. You may request access to,
        correction of, or deletion of your submitted personal data by contacting our
        support team.
      </p>

      <h2>Important notice</h2>
      <p>
        Do not transmit passwords, payment details, bookmaker credentials, or sensitive
        personal identification through the public contact form.
      </p>
    </LegalPageLayout>
  );
}
