import { timingSafeEqual } from "node:crypto";
import { runOddsSync } from "@playtoday/ingestion-worker";

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
    const result = await runOddsSync();
    return Response.json(result, { status: result.ok ? 200 : 503 });
  } catch {
    return Response.json(
      { ok: false, error: "Odds synchronization failed" },
      { status: 503 },
    );
  }
}
