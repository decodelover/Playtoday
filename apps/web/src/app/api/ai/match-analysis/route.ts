import { NextResponse } from "next/server";
import { getMatchAnalysis } from "../../../../lib/ai-analyst-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fixtureId = searchParams.get("fixtureId");

    if (!fixtureId) {
      return NextResponse.json({ error: "fixtureId parameter is required" }, { status: 400 });
    }

    const analysis = await getMatchAnalysis(fixtureId);
    return NextResponse.json({ ok: true, data: analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI analysis generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
