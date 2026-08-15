import { NextResponse } from "next/server";
import { publishDailyEdgeForDate } from "../../../../lib/daily-edge-service";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "local-cron-secret-not-for-production";

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0]!;

    const publication = await publishDailyEdgeForDate(date);

    return NextResponse.json({
      ok: true,
      data: {
        date,
        status: publication.status,
        combinedOdds: publication.originalCombinedOdds,
        legCount: publication.legs.length,
        bookmaker: publication.bookmakerName,
        passReason: publication.passReasonText,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Daily Edge publication failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
