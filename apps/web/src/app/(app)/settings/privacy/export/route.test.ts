import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  getUser: vi.fn(),
  profileEq: vi.fn(),
  profileSelect: vi.fn(),
  profileSingle: vi.fn(),
  preferencesEq: vi.fn(),
  preferencesSelect: vi.fn(),
  preferencesSingle: vi.fn(),
}));

vi.mock("../../../../../lib/supabase/server", () => ({
  createSupabaseServerClient: () =>
    Promise.resolve({
      auth: { getUser: mocks.getUser },
      from: mocks.from,
    }),
}));

import { GET } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getUser.mockResolvedValue({
    data: {
      user: {
        id: "user-a",
        email: "member@example.com",
        email_confirmed_at: "2026-08-01T00:00:00.000Z",
        created_at: "2026-07-01T00:00:00.000Z",
      },
    },
    error: null,
  });
  mocks.profileSingle.mockResolvedValue({
    data: { display_name: "Member" },
    error: null,
  });
  mocks.preferencesSingle.mockResolvedValue({
    data: { preferred_sports: ["football"] },
    error: null,
  });
  mocks.profileEq.mockReturnValue({ single: mocks.profileSingle });
  mocks.preferencesEq.mockReturnValue({ single: mocks.preferencesSingle });
  mocks.profileSelect.mockReturnValue({ eq: mocks.profileEq });
  mocks.preferencesSelect.mockReturnValue({ eq: mocks.preferencesEq });
  mocks.from.mockImplementation((table: string) => ({
    select: table === "profiles" ? mocks.profileSelect : mocks.preferencesSelect,
  }));
});

describe("account data export", () => {
  it("rejects an unauthenticated request before querying private tables", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });

    const response = await GET();

    expect(response.status).toBe(401);
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("scopes every private query to the authenticated account", async () => {
    const response = await GET();
    const payload = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(200);
    expect(mocks.profileEq).toHaveBeenCalledWith("id", "user-a");
    expect(mocks.preferencesEq).toHaveBeenCalledWith("user_id", "user-a");
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("content-disposition")).toContain("attachment");
    expect(payload).toMatchObject({
      account: { id: "user-a", email: "member@example.com" },
      profile: { display_name: "Member" },
      preferences: { preferred_sports: ["football"] },
    });
    expect(JSON.stringify(payload)).not.toMatch(/password|token|service_role/i);
  });

  it("returns a safe error without exposing database details", async () => {
    const stderr = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    mocks.profileSingle.mockResolvedValue({ data: null, error: { code: "42501" } });

    const response = await GET();
    const payload: unknown = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      error: "We couldn't prepare your account data. Try again.",
    });
    expect(JSON.stringify(payload)).not.toContain("42501");
    stderr.mockRestore();
  });
});
