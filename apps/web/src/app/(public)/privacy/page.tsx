import { LegalPageLayout } from "../../public-shell/marketing";
import { getPublicRoute, metadataFor } from "../../public-shell/routes";

export const metadata = metadataFor("privacy");

export default function Page() {
  return (
    <LegalPageLayout route={getPublicRoute("privacy")}>
      <p>
        <strong>[Pending Legal Review]</strong> This draft describes the personal data
        handled by the current public site. The legal operator and data-controller
        details have not been approved.
      </p>

      <h2>Information submitted through the contact form</h2>
      <p>
        The contact form collects your enquiry type, name, email address, subject, and
        message. PlayToday uses this information to review and respond to your enquiry
        and to keep a record of the request.
      </p>

      <h2>Where contact information is stored</h2>
      <p>
        Contact submissions are stored in Supabase. The public website cannot read,
        change, or delete submitted messages. Access is reserved for server-side
        processing and future authorized support administration.
      </p>

      <h2>Information the public site does not currently process</h2>
      <p>
        The public site has no account registration, subscription checkout, payment
        processing, betting wallet, or bookmaker-account connection. This draft does not
        claim that those systems exist.
      </p>

      <h2>Retention and legal basis</h2>
      <p>
        The retention period, legal basis for processing, operator identity, data
        controller, international-transfer terms, and formal privacy contact are
        [Pending Legal Review].
      </p>

      <h2>Your rights</h2>
      <p>
        Applicable privacy rights and the process for exercising them are [Pending Legal
        Review]. Do not send passwords, payment details, bookmaker credentials, or other
        sensitive information through the contact form.
      </p>
    </LegalPageLayout>
  );
}
