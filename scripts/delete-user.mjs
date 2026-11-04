// Delete a user's account by email.
// Usage: npm run users:delete -- someone@example.com          (local stack)
//        npm run users:delete:hosted -- someone@example.com   (hosted project; asks first)
// Their profile and templates are removed; matches they hosted or played in are kept
// with the user link set to NULL (shown as "Deleted user").
import {
  createAdminClient,
  findUserByEmail,
  isHostedRun,
  scriptArgs,
} from "./admin-client.mjs";

const email = scriptArgs[0];
if (!email) {
  console.error(
    `Usage: npm run ${isHostedRun ? "users:delete:hosted" : "users:delete"} -- <email>`,
  );
  process.exit(1);
}

console.log(`Deleting ${email}.`);
const supabase = await createAdminClient();
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
