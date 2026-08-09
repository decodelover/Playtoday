import { describe, expect, it } from "vitest";

import { parseContactSubmission } from "./contact-schema";

describe("contact submission validation", () => {
  it("removes unsafe control characters without changing line breaks", () => {
    const formData = new FormData();
    formData.set("enquiry_type", "privacy");
    formData.set("name", "Ada\u0000 Okafor");
    formData.set("email", "ada@example.com");
    formData.set("subject", "Privacy request");
    formData.set(
      "message",
      "First line of the request.\r\nSecond line of the request.",
    );
    formData.set("website", "");

    const result = parseContactSubmission(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Ada Okafor");
      expect(result.data.message).toContain("\n");
    }
  });

  it("rejects enquiry types outside the published form options", () => {
    const formData = new FormData();
    formData.set("enquiry_type", "billing");
    formData.set("name", "Ada Okafor");
    formData.set("email", "ada@example.com");
    formData.set("subject", "Billing question");
    formData.set("message", "This message has enough characters for validation.");
    formData.set("website", "");

    const result = parseContactSubmission(formData);

    expect(result.success).toBe(false);
  });
});
