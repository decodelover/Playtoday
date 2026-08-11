import type { Database } from "@playtoday/database-types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

function getPublicSupabaseKey(): string {
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (publishable && publishable.length > 0) {
    return publishable;
  }
  if (anon && anon.length > 0) {
    return anon;
  }
  return "sb_p_fallback_test_key_never_real_credentials";
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "https://project-ref.supabase.co";
  const supabaseKey = getPublicSupabaseKey();

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Guest-only routes
  const isAuthRoute =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/forgot-password";

  // Authenticated app routes
  const isProtectedRoute =
    pathname === "/overview" ||
    pathname === "/ai-analyst" ||
    pathname === "/games" ||
    pathname === "/daily-odds" ||
    pathname === "/target-odds" ||
    pathname === "/markets" ||
    pathname === "/selections" ||
    pathname === "/analytics" ||
    pathname === "/history" ||
    pathname === "/notifications" ||
    pathname === "/subscription" ||
    pathname.startsWith("/settings") ||
    pathname === "/support";

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/overview";
    return NextResponse.redirect(url);
  }

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
