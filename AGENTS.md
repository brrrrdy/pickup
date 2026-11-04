# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# Dev commands

- `npm start`: start the Expo dev server
- `npm run web`: run in the browser
- `npm run ios`: run on the iOS simulator
- `npm run android`: run on the Android emulator
- `npm run build:web`: export a static web build to `dist/`
- `npm test`: run the Jest suite
- `npm run test:watch`: run Jest in watch mode
- `npm run typecheck`: type-check with `tsc --noEmit`
- `npm run lint`: ESLint + Prettier check (`npm run format` to auto-format)
- `npm run validate`: typecheck + lint + tests

# Important

Run `npm run validate` (typecheck + lint + Jest) before every commit, and do not commit if it fails. This is what the Vercel build runs, and the `.githooks/pre-commit` hook enforces it.

# Supabase

- Local stack (Docker): `npx supabase start` runs Postgres, Auth, REST and Studio at http://127.0.0.1:54323. Stop it with `npx supabase stop`.
- `.env.local` points the app and scripts at the local stack, overriding `.env`. Delete it to use the hosted project. Restart `npm start` after changing env files.
- `npx supabase db reset` re-applies all migrations locally and wipes local data (re-run `npm run users:invite` afterwards).
- `npm run db:types` regenerates `lib/database.types.ts` from the local database after a schema change.
- Schema lives in `supabase/migrations/`. Never edit an applied migration; add a new one with `npx supabase migration new <name>`.
- One-time setup: `npx supabase login`, then `npx supabase link --project-ref <ref>`.
- Apply migrations to the linked project: `npx supabase db push --remote` (dry run first with `--dry-run`).
- Accounts are invite-only. Public signup is off in the dashboard (Authentication → Sign In / Providers) and in `supabase/config.toml`.
- `npm run users:invite`: create the accounts listed in `supabase/invites.json` (git-ignored; copy `invites.example.json`).
- `npm run users:delete -- <email>`: delete an account. Its matches are kept, with the user shown as deleted.
- Both scripts need `SUPABASE_SECRET_KEY` in `.env.local` (git-ignored; see `.env.local.example`). Never give it an `EXPO_PUBLIC_` prefix or import it from app code.
- Hosted accounts: `npm run users:invite:hosted` (reads `supabase/invites.hosted.json`) and `npm run users:delete:hosted -- <email>`. They use `.env` for the URL and the hosted secret key from `.env.hosted.local` (git-ignored; see `.env.hosted.local.example`). Each script prints its target first.
- Hosted CLI commands need `--remote` (e.g. `npx supabase db push --remote`); without it they target the local stack.
- Venues are never deleted. Retire one with `update public.venues set is_active = false where name = '...'`.
- A venue only appears in Start Game for the sports listed for it in `public.venue_sports`. Add those rows with every new venue or sport (in a migration).
- Match start times are entered in the city's `timezone` (default `Europe/Madrid`) and stored in UTC.
- Matches are never deleted. Joining, leaving and cancelling go through the `join_match`, `leave_match` and `cancel_match` RPCs.
