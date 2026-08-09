import "server-only";

import { createContactSupabaseClient } from "../../../lib/supabase/contact-client";
import type { ContactSubmissionInput } from "./contact-schema";

export async function persistContactSubmission(input: ContactSubmissionInput) {
  const supabase = createContactSupabaseClient();
  const { error } = await supabase.from("contact_submissions").insert(input);

  if (error) {
    throw new Error("Contact submission insert failed.");
  }
}
