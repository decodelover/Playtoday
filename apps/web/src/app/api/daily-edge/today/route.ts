import { NextResponse } from "next/server";
import { getDailyEdgeForDate } from "../../../../lib/daily-edge-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") ?? undefined;
    const dailyEdge = await getDailyEdgeForDate(date);

    if (!dailyEdge) {
      return NextResponse.json({
        ok: true,
        data: {
          status: "evaluating",
          message: "Daily Edge is currently being computed for this date.",
        },
      });
    }

    return NextResponse.json({ ok: true, data: dailyEdge });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch Daily Edge";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
