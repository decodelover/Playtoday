import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { runSportsSync } = vi.hoisted(() => ({ runSportsSync: vi.fn() }));

vi.mock("@playtoday/ingestion-worker", () => ({ runSportsSync }));

describe("sports sync cron route", () => {
  const previousSecret = process.env.CRON_SECRET;

  beforeEach(() => {
    process.env.CRON_SECRET = "test-cron-secret-not-a-credential";
    runSportsSync.mockReset();
  });

  afterEach(() => {
    if (previousSecret === undefined) {
      delete process.env.CRON_SECRET;
    } else {
      process.env.CRON_SECRET = previousSecret;
    }
  });

  it("denies a request without the cron bearer secret", async () => {
    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://playtoday.example/api/cron/sports-sync"),
    );

    expect(response.status).toBe(401);
    expect(runSportsSync).not.toHaveBeenCalled();
  });

  it("runs a bounded sync for an authorized request", async () => {
    runSportsSync.mockResolvedValue({
      ok: true,
      runId: "run-id",
      scope: { date: "2026-08-14", live: false, healthOnly: false },
      providerRequests: 2,
      received: { competitions: 1, seasons: 1, teams: 2, fixtures: 1 },
      inserted: {
        competitions: 1,
        seasons: 1,
        teams: 2,
        venues: 1,
        fixtures: 1,
        provider_entity_mappings: 6,
      },
      updatedFixtures: 0,
      rejected: 0,
    });
    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://playtoday.example/api/cron/sports-sync", {
        headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
      }),
    );

    expect(response.status).toBe(200);
    expect(runSportsSync).toHaveBeenCalledOnce();
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      runId: "run-id",
      providerRequests: 2,
    });
  });

  it("returns a safe error when synchronization fails", async () => {
    runSportsSync.mockRejectedValue(new Error("sensitive upstream detail"));
    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://playtoday.example/api/cron/sports-sync", {
        headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "Fixture synchronization failed",
    });
  });
});
