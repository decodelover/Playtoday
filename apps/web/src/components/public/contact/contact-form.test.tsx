// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "./contact-form";

vi.mock("../../../app/(public)/contact/actions", () => ({
  submitContactForm: vi.fn(),
}));

afterEach(cleanup);

describe("ContactForm", () => {
  it("provides visible labels, safe guidance, and a submit action", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText("Enquiry type")).toBeRequired();
    expect(screen.getByLabelText("Name")).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText("Email address")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Subject")).toBeRequired();
    expect(screen.getByLabelText("Message")).toHaveAttribute("minlength", "20");
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
    expect(screen.getByText(/Do not include passwords/i)).toBeVisible();
  });
});
