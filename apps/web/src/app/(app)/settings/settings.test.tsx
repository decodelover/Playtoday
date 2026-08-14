// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { UserPreferencesInput } from "@playtoday/validation";
import { NotificationsForm } from "./notifications/notifications-form";
import { PreferencesForm } from "./preferences/preferences-form";
import { ProfileForm } from "./profile/profile-form";
import { PasswordForm, SessionControls } from "./security/security-controls";
import { SettingsNav } from "./settings-nav";

const actionMocks = vi.hoisted(() => ({
  displayName: vi.fn(),
  notifications: vi.fn(),
  preferences: vi.fn(),
  timezone: vi.fn(),
}));

const authMocks = vi.hoisted(() => ({
  signOut: vi.fn(),
  updateUser: vi.fn(),
}));

const routerMocks = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));

vi.mock("../../actions/settings", () => ({
  updateDisplayNameAction: actionMocks.displayName,
  updateNotificationChannelsAction: actionMocks.notifications,
  updatePreferencesAction: actionMocks.preferences,
  updateTimezoneAction: actionMocks.timezone,
}));

vi.mock("../../../lib/supabase/client", () => ({
  createSupabaseBrowserClient: () => ({ auth: authMocks }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/settings/preferences",
  useRouter: () => routerMocks,
}));

const preferences: UserPreferencesInput = {
  preferred_sports: ["football"],
  preferred_bookmakers: ["sportybet"],
  preferred_markets: ["1x2"],
  target_odds: 3,
  default_strategy: "balanced",
  risk_preference: "moderate",
  notification_channels: { email: false, in_app: true },
  responsible_play_ack: true,
  timezone: "Africa/Lagos",
};

beforeEach(() => {
  vi.clearAllMocks();
  actionMocks.displayName.mockResolvedValue({ success: true });
  actionMocks.timezone.mockResolvedValue({ success: true });
  actionMocks.preferences.mockResolvedValue({ success: true });
  actionMocks.notifications.mockResolvedValue({ success: true });
  authMocks.updateUser.mockResolvedValue({ error: null });
  authMocks.signOut.mockResolvedValue({ error: null });
});

afterEach(cleanup);

describe("settings experience", () => {
  it("provides deep-linked settings navigation with a current location", () => {
    render(<SettingsNav />);
    expect(screen.getByRole("navigation", { name: "Settings" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Preferences" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("saves display name and timezone through authenticated server actions", async () => {
    render(<ProfileForm displayName="Amina" timezone="Africa/Lagos" />);

    fireEvent.change(screen.getByLabelText("Display name"), {
      target: { value: "Amina Okafor" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save name" }));
    await waitFor(() =>
      expect(actionMocks.displayName).toHaveBeenCalledWith("Amina Okafor"),
    );
    expect(await screen.findByText("Your display name is saved.")).toBeVisible();

    fireEvent.change(screen.getByLabelText("IANA timezone"), {
      target: { value: "Europe/London" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save timezone" }));
    await waitFor(() =>
      expect(actionMocks.timezone).toHaveBeenCalledWith("Europe/London"),
    );
  });

  it("edits the same canonical preference shape used by onboarding", async () => {
    render(<PreferencesForm initial={preferences} />);
    expect(screen.getByRole("checkbox", { name: /Football/i })).toBeDisabled();

    fireEvent.click(screen.getByRole("checkbox", { name: /Bet9ja/i }));
    fireEvent.change(screen.getByLabelText("Default target odds"), {
      target: { value: "4.25" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save preferences" }));

    await waitFor(() => expect(actionMocks.preferences).toHaveBeenCalledOnce());
    expect(actionMocks.preferences.mock.calls[0]?.[0]).toMatchObject({
      preferred_bookmakers: ["sportybet", "bet9ja"],
      target_odds: 4.25,
      responsible_play_ack: true,
    });
  });

  it("persists only supported notification channels", async () => {
    render(<NotificationsForm initial={{ email: false, in_app: true }} />);
    expect(screen.getByText(/push/i)).toHaveTextContent(
      "Push notifications are not available",
    );
    fireEvent.click(screen.getByRole("checkbox", { name: /Email/i }));
    fireEvent.click(screen.getByRole("button", { name: "Save notifications" }));
    await waitFor(() =>
      expect(actionMocks.notifications).toHaveBeenCalledWith({
        email: true,
        in_app: true,
      }),
    );
  });

  it("changes a password without logging its contents", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    render(<PasswordForm />);
    fireEvent.change(screen.getByLabelText("Current password"), {
      target: { value: "current-password" },
    });
    fireEvent.change(screen.getByLabelText("New password"), {
      target: { value: "new-password-123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm new password"), {
      target: { value: "new-password-123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Change password" }));

    await waitFor(() =>
      expect(authMocks.updateUser).toHaveBeenCalledWith({
        current_password: "current-password",
        password: "new-password-123",
      }),
    );
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("uses a real other-session revocation scope without inventing devices", async () => {
    render(<SessionControls />);
    expect(
      screen.queryByText(/Chrome|Windows|Lagos|last active/i),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sign out other sessions" }));
    await waitFor(() =>
      expect(authMocks.signOut).toHaveBeenCalledWith({ scope: "others" }),
    );
    expect(
      screen.getByText("Other refresh sessions have been signed out."),
    ).toBeVisible();
  });
});
