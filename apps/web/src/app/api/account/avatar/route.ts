import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const avatarUrl = typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : null;

    if (!avatarUrl) {
      return NextResponse.json({ error: "Avatar URL or image data is required" }, { status: 400 });
    }

    // Limit payload size to avoid oversized database storage
    if (avatarUrl.length > 500000) {
      return NextResponse.json({ error: "Image file size exceeds maximum limit (350KB)" }, { status: 400 });
    }

    const { error: updateError } = await (supabase.from("profiles") as any)
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ ok: true, avatarUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update avatar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error: updateError } = await (supabase.from("profiles") as any)
      .update({
        avatar_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to remove avatar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
