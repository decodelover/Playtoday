import type { Database } from "@playtoday/database-types";
import { createBrowserClient } from "@supabase/ssr";

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

export function createSupabaseBrowserClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "https://project-ref.supabase.co";
  const supabaseKey = getPublicSupabaseKey();

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
