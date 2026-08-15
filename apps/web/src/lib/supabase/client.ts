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
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua2NsbXlydmJxZGt0Y3FqY3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyMzAwMDEsImV4cCI6MjEwMTgwNjAwMX0.bRvqDecmL7DZB4zQKVm5ZstDUpmAruOSJlRDxjDbprQ";
}

export function createSupabaseBrowserClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "https://enkclmyrvbqdktcqjcvf.supabase.co";
  const supabaseKey = getPublicSupabaseKey();

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
