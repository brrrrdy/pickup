// Create invited users from supabase/invites.json.
// Usage: npm run users:invite          (local, supabase/invites.json)
//        npm run users:invite:hosted   (hosted, supabase/invites.hosted.json)
// Each entry: { "email": "...", "password": "...", "display_name": "..." }
// A profile row is created automatically by the on_auth_user_created trigger.
import { readFileSync } from "node:fs";
import { createAdminClient } from "./admin-client.mjs";

const INVITES_PATH = process.argv[2] ?? "supabase/invites.json";

let invites;
try {
  invites = JSON.parse(readFileSync(INVITES_PATH, "utf8"));
} catch (error) {
  console.error(`Could not read ${INVITES_PATH}: ${error.message}`);
  console.error(`Copy supabase/invites.example.json to ${INVITES_PATH}.`);
  process.exit(1);
}

const supabase = createAdminClient();
const summary = { created: 0, skipped: 0, failed: 0 };

for (const invite of invites) {
  const email = invite.email?.trim().toLowerCase();

  if (!email || !invite.password || invite.password.length < 8) {
    console.error(
      `✗ ${email ?? "(no email)"}: needs an email and an 8+ character password`,
    );
    summary.failed++;
    continue;
  }

  const { error } = await supabase.auth.admin.createUser({
    email,
    password: invite.password,
    email_confirm: true,
    user_metadata: { display_name: invite.display_name },
  });

  if (!error) {
    console.log(`✓ ${email} created`);
    summary.created++;
  } else if (error.code === "email_exists") {
    console.log(`- ${email} already exists, skipped`);
    summary.skipped++;
  } else {
    console.error(`✗ ${email}: ${error.message}`);
    summary.failed++;
  }
}

console.log(
  `\n${summary.created} created, ${summary.skipped} skipped, ${summary.failed} failed`,
);
process.exit(summary.failed ? 1 : 0);
