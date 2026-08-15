import { NextResponse } from "next/server";
import { getDailyEdgeHistory } from "../../../../lib/daily-edge-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "30");
    const history = await getDailyEdgeHistory(isNaN(limit) ? 30 : limit);

    return NextResponse.json({ ok: true, data: history });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch Daily Edge history";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
