import { timingSafeEqual } from "node:crypto";
import { runSportsSync } from "@playtoday/ingestion-worker";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization");
  if (!secret || !authorization) {
    return false;
  }
  const expected = Buffer.from(`Bearer ${secret}`);
  const supplied = Buffer.from(authorization);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runSportsSync();
    return Response.json({
      ok: result.ok,
      runId: result.runId,
      scope: result.scope,
      providerRequests: result.providerRequests,
      received: result.received,
      inserted: result.inserted,
      updatedFixtures: result.updatedFixtures,
      rejected: result.rejected,
    });
  } catch {
    return Response.json(
      { ok: false, error: "Fixture synchronization failed" },
      { status: 503 },
    );
  }
}
