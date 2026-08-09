import { beforeEach, describe, expect, it, vi } from "vitest";

import { persistContactSubmission } from "../../../components/public/contact/persist-contact";
import { initialContactFormState } from "../../../components/public/contact/contact-form-state";
import { submitContactForm } from "./actions";

vi.mock("../../../components/public/contact/persist-contact", () => ({
  persistContactSubmission: vi.fn(),
}));

const persistContactSubmissionMock = vi.mocked(persistContactSubmission);

function validFormData() {
  const formData = new FormData();
  formData.set("enquiry_type", "product");
  formData.set("name", "  Ada   Okafor  ");
  formData.set("email", "ADA@EXAMPLE.COM");
  formData.set("subject", "  Product   access  ");
  formData.set(
    "message",
    "Please explain when public product access will become available.",
  );
  formData.set("website", "");
  return formData;
}

beforeEach(() => {
  persistContactSubmissionMock.mockReset();
});

describe("submitContactForm", () => {
  it("normalizes and persists a valid submission before reporting success", async () => {
    persistContactSubmissionMock.mockResolvedValue(undefined);

    const state = await submitContactForm(initialContactFormState, validFormData());

    expect(persistContactSubmissionMock).toHaveBeenCalledWith({
      enquiry_type: "product",
      name: "Ada Okafor",
      email: "ada@example.com",
      subject: "Product access",
      message: "Please explain when public product access will become available.",
    });
    expect(state).toEqual({
      status: "success",
      message: "Your message has been saved for review.",
      fieldErrors: {},
    });
  });

  it("does not persist an invalid submission", async () => {
    const formData = validFormData();
    formData.set("message", "Too short");

    const state = await submitContactForm(initialContactFormState, formData);

    expect(persistContactSubmissionMock).not.toHaveBeenCalled();
    expect(state.status).toBe("error");
    expect(state.fieldErrors.message?.[0]).toMatch(/at least 20 characters/i);
  });

  it("rejects a filled honeypot without persistence", async () => {
    const formData = validFormData();
    formData.set("website", "https://example.com");

    const state = await submitContactForm(initialContactFormState, formData);

    expect(persistContactSubmissionMock).not.toHaveBeenCalled();
    expect(state.status).toBe("error");
  });

  it("reports failure when Supabase does not confirm persistence", async () => {
    persistContactSubmissionMock.mockRejectedValue(new Error("database unavailable"));

    const state = await submitContactForm(initialContactFormState, validFormData());

    expect(state.status).toBe("error");
    expect(state.message).toMatch(/was not saved/i);
    expect(state.message).not.toMatch(/database unavailable/i);
  });
});
