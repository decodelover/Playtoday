// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthLayout from "./layout";
import ForgotPasswordPage from "./forgot-password/page";
import SignInPage from "./sign-in/page";
import SignUpPage from "./sign-up/page";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(() => null),
  }),
  usePathname: () => "/sign-in",
}));

// Mock Supabase browser client
vi.mock("../../lib/supabase/client", () => ({
  createSupabaseBrowserClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  }),
}));

describe("Authentication Pages & Reference Layout", () => {
  it("renders desktop hero card with Back to Home button", () => {
    render(
      <AuthLayout>
        <div>Auth Content</div>
      </AuthLayout>,
    );

    expect(
      screen.getByRole("region", { name: /PlayToday overview/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Explainable sports intelligence for today's games\./i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /← Back to Home/i })).toBeInTheDocument();
  });

  it("renders Sign In page with required form controls, OAuth triggers, and security links", () => {
    render(
      <AuthLayout>
        <SignInPage />
      </AuthLayout>,
    );

    expect(screen.getByRole("link", { name: /^Sign In$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign in with Google/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign in with Apple/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign in →/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Forgot password\?/i }),
    ).toBeInTheDocument();
  });

  it("renders Sign Up page with OAuth triggers, required fields, and age/terms agreement", () => {
    render(
      <AuthLayout>
        <SignUpPage />
      </AuthLayout>,
    );

    expect(
      screen.getAllByRole("link", { name: /^Create Account$/i })[0],
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign up with Google/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign up with Apple/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password \(min 8 characters\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create account →/i }),
    ).toBeInTheDocument();
  });

  it("renders Forgot Password page with enumeration-resistant form", () => {
    render(
      <AuthLayout>
        <ForgotPasswordPage />
      </AuthLayout>,
    );

    expect(
      screen.getByRole("heading", { name: /Reset your password/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send reset instructions →/i }),
    ).toBeInTheDocument();
  });
});
