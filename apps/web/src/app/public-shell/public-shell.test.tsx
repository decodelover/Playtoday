// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, vi, describe, expect, it } from "vitest";
import { PublicShell } from "./public-shell";
vi.mock("next/navigation", () => ({ usePathname: () => "/pricing" }));
afterEach(cleanup);

describe("public shell", () => {
  it("renders accessible navigation, actions and footer without authenticated UI", () => {
    render(
      <PublicShell>
        <h1>Page</h1>
      </PublicShell>,
    );
    expect(screen.getByRole("link", { name: "PlayToday home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("navigation", { name: "Primary public navigation" }),
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole("navigation", { name: "Primary public navigation" })
        .querySelector('a[href="/pricing"]'),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/sign-in",
    );
    expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute(
      "href",
      "/sign-up",
    );
    expect(
      screen.getByRole("navigation", { name: "Footer navigation" }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Application sidebar")).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/deposit|guaranteed results/i);
  });
  it("opens and closes its focus-managed mobile menu", async () => {
    render(
      <PublicShell>
        <h1>Page</h1>
      </PublicShell>,
    );
    const trigger = screen.getByRole("button", { name: "Open public navigation" });
    fireEvent.click(trigger);
    expect(
      await screen.findByRole("navigation", { name: "Mobile public navigation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Close public navigation" }),
    ).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() =>
      expect(
        screen.queryByRole("navigation", { name: "Mobile public navigation" }),
      ).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });
});
