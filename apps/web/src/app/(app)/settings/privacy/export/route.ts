import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "../../../../../lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Your session has ended. Sign in again." },
      { status: 401 },
    );
  }

  const [profileResult, preferencesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "avatar_url, created_at, display_name, onboarding_completed_at, onboarding_step, updated_at",
      )
      .eq("id", user.id)
      .single(),
    supabase
      .from("user_preferences")
      .select(
        "created_at, default_strategy, notification_channels, preferred_bookmakers, preferred_markets, preferred_sports, responsible_play_ack, risk_preference, target_odds, timezone, updated_at",
      )
      .eq("user_id", user.id)
      .single(),
  ]);

  if (profileResult.error || preferencesResult.error) {
    process.stderr.write(
      `${JSON.stringify({
        event: "account_export_failed",
        databaseCode: profileResult.error?.code ?? preferencesResult.error?.code,
      })}\n`,
    );
    return NextResponse.json(
      { error: "We couldn't prepare your account data. Try again." },
      { status: 500 },
    );
  }

  const exportedAt = new Date().toISOString();
  return NextResponse.json(
    {
      exported_at: exportedAt,
      account: {
        id: user.id,
        email: user.email ?? null,
        email_confirmed_at: user.email_confirmed_at ?? null,
        created_at: user.created_at,
      },
      profile: profileResult.data,
      preferences: preferencesResult.data,
      exclusions: {
        contact_submissions:
          "Contact messages are not linked to the authenticated account ID.",
      },
    },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Disposition": 'attachment; filename="playtoday-account-data.json"',
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
