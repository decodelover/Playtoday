import { NextResponse } from "next/server";
import { generateTargetOdds } from "../../../../lib/ai-analyst-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetMultiplier = Number(body.targetMultiplier ?? 3.0);
    const riskTolerance = body.riskTolerance === "aggressive" || body.riskTolerance === "conservative"
      ? body.riskTolerance
      : "balanced";

    const result = await generateTargetOdds({ targetMultiplier, riskTolerance });
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Target odds generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
