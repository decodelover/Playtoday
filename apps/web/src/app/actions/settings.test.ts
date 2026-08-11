import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  eq: vi.fn(),
  from: vi.fn(),
  getUser: vi.fn(),
  revalidatePath: vi.fn(),
  update: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("../../lib/supabase/server", () => ({
  createSupabaseServerClient: () =>
    Promise.resolve({
      auth: { getUser: mocks.getUser },
      from: mocks.from,
    }),
}));

import {
  updateDisplayNameAction,
  updateNotificationChannelsAction,
  updatePreferencesAction,
} from "./settings";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getUser.mockResolvedValue({
    data: { user: { id: "user-a" } },
    error: null,
  });
  mocks.eq.mockResolvedValue({ error: null });
  mocks.update.mockReturnValue({ eq: mocks.eq });
  mocks.from.mockReturnValue({ update: mocks.update });
});

describe("settings actions", () => {
  it("rejects an invalid display name before touching Supabase", async () => {
    await expect(updateDisplayNameAction("A")).resolves.toEqual({
      success: false,
      error: "Enter at least 2 characters.",
    });
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("derives profile ownership from the authenticated user", async () => {
    await expect(updateDisplayNameAction("Amina Okafor")).resolves.toEqual({
      success: true,
    });
    expect(mocks.from).toHaveBeenCalledWith("profiles");
    expect(mocks.eq).toHaveBeenCalledWith("id", "user-a");
  });

  it("rejects unauthenticated notification writes", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(
      updateNotificationChannelsAction({ email: true, in_app: true }),
    ).resolves.toEqual({
      success: false,
      error: "Your session has ended. Sign in again.",
    });
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("preserves the completed responsible-play acknowledgement", async () => {
    const result = await updatePreferencesAction({
      preferred_sports: ["football"],
      preferred_bookmakers: ["sportybet"],
      preferred_markets: ["1x2"],
      target_odds: 3,
      default_strategy: "balanced",
      risk_preference: "moderate",
      notification_channels: { email: false, in_app: true },
      responsible_play_ack: false,
      timezone: "Africa/Lagos",
    });
    expect(result.success).toBe(false);
    expect(mocks.from).not.toHaveBeenCalled();
  });
});
