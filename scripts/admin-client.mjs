// Shared Supabase admin client for the user management scripts, local and hosted.
// Local scripts read the local stack's secret key from .env.local; the :hosted
// scripts read the hosted secret key from .env.hosted.local. The secret key
// bypasses every RLS rule. Never import this from app code.
import { createInterface } from "node:readline/promises";
import { createClient } from "@supabase/supabase-js";

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "[::1]"]);

/** True when the script was started through a :hosted npm script. */
export const isHostedRun = process.argv.includes("--hosted");

/** Script arguments with the --hosted flag removed. */
export const scriptArgs = process.argv
  .slice(2)
  .filter((arg) => arg !== "--hosted");

async function confirm(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`${question} [y/N] `);
    return answer.trim().toLowerCase() === "y";
  } finally {
    rl.close();
  }
}

/**
 * Creates the admin client after checking it points where the script expects:
 * :hosted scripts refuse a local URL and local scripts refuse a hosted one
 * (e.g. when a shell-exported variable overrides the env files). Hosted runs
 * ask for confirmation before anything changes.
 */
export async function createAdminClient() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const keyFile = isHostedRun ? ".env.hosted.local" : ".env.local";

  if (!url || !secretKey) {
    console.error(
      `Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY (expected in .env / ${keyFile}).`,
    );
    process.exit(1);
  }

  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    console.error(`EXPO_PUBLIC_SUPABASE_URL is not a valid URL: ${url}`);
    process.exit(1);
  }

  const isLocalUrl = LOCAL_HOSTS.has(host);

  if (isHostedRun && isLocalUrl) {
    console.error(
      `Refusing: this is a :hosted script but the URL is local (${host}). Check .env and your shell for an exported EXPO_PUBLIC_SUPABASE_URL.`,
    );
    process.exit(1);
  }

  if (!isHostedRun && !isLocalUrl) {
    console.error(
      `Refusing: this is a local script but the URL is hosted (${host}). Use the :hosted script, or check .env.local and your shell for an exported EXPO_PUBLIC_SUPABASE_URL.`,
    );
    process.exit(1);
  }

  if (isHostedRun) {
    console.log(`Target: ${host} (HOSTED, real accounts)`);
    if (!(await confirm("Continue?"))) {
      console.log("Cancelled. Nothing was changed.");
      process.exit(1);
    }
    console.log();
  } else {
    console.log(`Target: ${host} (local)\n`);
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
