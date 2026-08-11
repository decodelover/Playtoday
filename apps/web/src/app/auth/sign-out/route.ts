import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut({ scope: "local" });

  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/sign-in`, { status: 302 });
}

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut({ scope: "local" });

  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/sign-in`, { status: 302 });
}
