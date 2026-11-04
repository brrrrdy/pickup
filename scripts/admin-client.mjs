// Shared Supabase admin client for local-only user management scripts.
// Uses the secret (service role) key from .env.local. Never import this from app code.
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    console.error(
      "Missing EXPO_PUBLIC_SUPABASE_URL (.env) or SUPABASE_SECRET_KEY (.env.local).",
    );
    process.exit(1);
  }

  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function findUserByEmail(supabase, email) {
  const target = email.trim().toLowerCase();
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === target);
    if (match) return match;
    if (data.users.length < 1000) return null;
  }
}
