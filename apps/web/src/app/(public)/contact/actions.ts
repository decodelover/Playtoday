"use server";

import { parseContactSubmission } from "../../../components/public/contact/contact-schema";
import type { ContactFormState } from "../../../components/public/contact/contact-form-state";
import { persistContactSubmission } from "../../../components/public/contact/persist-contact";

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const result = parseContactSubmission(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Check the marked fields and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { website: _website, ...submission } = result.data;

  try {
    await persistContactSubmission(submission);
  } catch {
    return {
      status: "error",
      message:
        "Your message was not saved. Please try again later and do not resend sensitive information.",
      fieldErrors: {},
    };
  }

  return {
    status: "success",
    message: "Your message has been saved for review.",
    fieldErrors: {},
  };
}
