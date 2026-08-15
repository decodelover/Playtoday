import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { runOddsSync } = vi.hoisted(() => ({ runOddsSync: vi.fn() }));
vi.mock("@playtoday/ingestion-worker", () => ({ runOddsSync }));

describe("odds sync cron route", () => {
  const previousSecret = process.env.CRON_SECRET;

  beforeEach(() => {
    process.env.CRON_SECRET = "test-cron-secret-not-a-credential";
    runOddsSync.mockReset();
  });

  afterEach(() => {
    if (previousSecret === undefined) {
      delete process.env.CRON_SECRET;
    } else {
      process.env.CRON_SECRET = previousSecret;
    }
  });

  it("denies requests without the cron bearer secret", async () => {
    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://playtoday.example/api/cron/odds-sync"),
    );
    expect(response.status).toBe(401);
    expect(runOddsSync).not.toHaveBeenCalled();
  });

  it("returns bounded sync metrics for an authorized request", async () => {
    runOddsSync.mockResolvedValue({
      ok: true,
      provider: "api-football",
      date: "2026-08-14",
      runId: "odds-run-id",
      requestsUsed: 2,
      eventsReceived: 20,
      currentPricesCreated: 100,
    });
    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://playtoday.example/api/cron/odds-sync", {
        headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
      }),
    );
    expect(response.status).toBe(200);
    expect(runOddsSync).toHaveBeenCalledOnce();
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      runId: "odds-run-id",
      requestsUsed: 2,
    });
  });

  it("does not expose provider errors", async () => {
    runOddsSync.mockRejectedValue(new Error("sensitive upstream detail"));
    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://playtoday.example/api/cron/odds-sync", {
        headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
      }),
    );
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "Odds synchronization failed",
    });
  });
});
