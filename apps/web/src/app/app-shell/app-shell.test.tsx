// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppShell, RouteBreadcrumbs } from "./app-shell";
import { PagePlaceholder } from "./page-placeholder";
import { getShellRoute } from "./routes";

vi.mock("next/navigation", () => ({ usePathname: () => "/games" }));
vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

afterEach(cleanup);

describe("application shell", () => {
  it("renders landmarks, skip link, grouped desktop navigation, and current page", () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    const desktop = screen.getByRole("navigation", {
      name: "Desktop application navigation",
    });
    expect(
      within(desktop).getByRole("link", { name: "Today's Games" }),
    ).toHaveAttribute("aria-current", "page");
    expect(within(desktop).getAllByRole("link")).toHaveLength(14);
  }, 15_000);

  it("collapses the sidebar while retaining accessible route names", () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(
      screen.getByRole("navigation", { name: "Desktop application navigation" }),
    ).toContainElement(screen.getAllByRole("link", { name: "Overview" }).at(0)!);
  });

  it("shows clean mobile header with hamburger, search and profile", async () => {
    render(
      <AppShell account={{ displayName: "Amina Okafor", email: "amina@example.com" }}>
        <p>Page content</p>
      </AppShell>,
    );
    expect(screen.getByRole("button", { name: "Open navigation" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Search PlayToday" })).toBeVisible();
    expect(screen.getAllByRole("link", { name: "Notifications" })[0]).toBeVisible();
    expect(screen.getByRole("button", { name: "Account menu" })).toHaveTextContent(
      "AO",
    );
    fireEvent.pointerDown(screen.getByRole("button", { name: "Account menu" }), {
      button: 0,
      ctrlKey: false,
    });
    expect(await screen.findByText("Amina Okafor")).toBeVisible();
    expect(screen.getByText("amina@example.com")).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Profile" })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Security" })).toBeVisible();
    expect(document.body.textContent).not.toMatch(/unread|premium plan|john doe/i);
  });

  it("opens the full mobile drawer, closes with Escape, and restores focus", async () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );
    const trigger = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(trigger);
    expect(await screen.findByRole("dialog", { name: /PlayToday/i })).toBeVisible();
    expect(screen.getByRole("button", { name: "Close navigation" })).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes the full navigation after selecting a route", async () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    const drawer = await screen.findByRole("dialog", { name: /PlayToday/i });
    fireEvent.click(within(drawer).getByRole("link", { name: "Overview" }));
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: /PlayToday/i }),
      ).not.toBeInTheDocument(),
    );
  });
});

describe("breadcrumbs and placeholders", () => {
  it("announces the current breadcrumb", () => {
    render(<RouteBreadcrumbs />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    expect(screen.getByText("Today's Games")).toHaveAttribute("aria-current", "page");
  });

  it("clearly identifies unavailable pages without internal product language", () => {
    const { container } = render(
      <PagePlaceholder route={getShellRoute("daily-odds")} />,
    );
    expect(screen.getByText("Not available")).toBeVisible();
    expect(container).toHaveTextContent(
      "has no live sports data, selections, fixtures, odds, or working tools",
    );
    expect(container.textContent).not.toMatch(/phase|prototype|placeholder|roadmap/i);
    expect(container.textContent).not.toMatch(/guaranteed|booking code|100% accurate/i);
  });
});
