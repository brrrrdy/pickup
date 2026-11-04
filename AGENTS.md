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

- Schema lives in `supabase/migrations/`. Never edit an applied migration; add a new one with `npx supabase migration new <name>`.
- One-time setup: `npx supabase login`, then `npx supabase link --project-ref <ref>`.
- Apply migrations to the linked project: `npx supabase db push`.
- Accounts are invite-only. Public signup is off in the dashboard (Authentication → Sign In / Providers) and in `supabase/config.toml`.
- `npm run users:invite`: create the accounts listed in `supabase/invites.json` (git-ignored; copy `invites.example.json`).
- `npm run users:delete -- <email>`: delete an account. Its matches are kept, with the user shown as deleted.
- Both scripts need `SUPABASE_SECRET_KEY` in `.env.local` (git-ignored; see `.env.local.example`). Never give it an `EXPO_PUBLIC_` prefix or import it from app code.
- Venues are never deleted. Retire one with `update public.venues set is_active = false where name = '...'`.
- Matches are never deleted. Joining, leaving and cancelling go through the `join_match`, `leave_match` and `cancel_match` RPCs.
