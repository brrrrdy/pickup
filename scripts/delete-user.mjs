// Delete a user's account by email.
// Usage: npm run users:delete -- someone@example.com
// Their profile and templates are removed; matches they hosted or played in are kept
// with the user link set to NULL (shown as "Deleted user").
import { createAdminClient, findUserByEmail } from "./admin-client.mjs";

const email = process.argv[2];
if (!email) {
  console.error("Usage: npm run users:delete -- <email>");
  process.exit(1);
}

const supabase = createAdminClient();
const user = await findUserByEmail(supabase, email);

if (!user) {
  console.error(`No user with email ${email}`);
  process.exit(1);
}

const { error } = await supabase.auth.admin.deleteUser(user.id);
if (error) {
  console.error(`✗ ${email}: ${error.message}`);
  process.exit(1);
}

console.log(`✓ ${email} deleted`);
