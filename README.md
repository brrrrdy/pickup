# pickup

## Description

A cross-platform application that brings together users searching for casual, non-competitive 'pick-up' sports games hosted at both free-to-use public venues (public basketball courts, padel courts, parks, town squares) and privately owned venues (tennis clubs, venues that require an external booking, golf courses, 5-a-side pitches, private tennis and basketball courts etc).

I am primarily trying to appeal to people interested in picking up a sport for the first time. It can be difficult and even counter-productive to start in a more formal environment when playing something new. Sports clubs and even private lessons can be and very often are difficult to approach, and act as a gatekeeper, both in financial and social terms, to accessing a sport. I want to remove that barrier, to encourage community outside the closed-garden of traditional sports clubs, and to make accessing a sport easy and hassle free.

Whilst free-to-use outdoor spaces such as municipal parks, recreation grounds, basketball and football courts are the primary focus during the first phase of development, the goal once this proof of concept prototype has been demonstrated, will be to incorporate paid-for facilities that require a separate action to access.

Users will download and sign up to pickup. They will be able to create matches at a venue, specify values such as a start time and how long they would like to play for, skill level, languages spoken, age ranges, competitiveness, availability to teach players how to play, and then push the match 'live'. Other users on the app interested in playing casual sports will be presented with these matches and subsequently sign up for a particular session.

My intention for security and privacy purposes is to handle all communication within the app itself. Users are free to share personal contact details but should be dissuaded from doing so as, in addition to security concerns, keeping these interactions in-house and within the 'ecosystem' promotes inclusion and new users hoping to join games.

## Development

### Setup

```sh
npm install
```

Create a `.env` file in the project root (it is git-ignored):

```sh
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

### Run the app

| Command                            | What it does                                                             |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `npm run web`                      | Start the dev server and open the web app                                |
| `npm start`                        | Start the dev server (press `w` web, `i` iOS, `a` Android)               |
| `npm run ios` / `npm run android`  | Start the dev server and open a simulator/emulator                       |
| `npx expo start --web --localhost` | Dev server on this machine only                                          |
| `npx expo start --lan`             | Dev server reachable from a phone on the same Wi-Fi                      |
| `npx expo start -c`                | Start with a cleared Metro cache (use after CSS/theme or config changes) |

### Test and check

| Command                               | What it does                                      |
| ------------------------------------- | ------------------------------------------------- |
| `npm test`                            | Run the Jest test suite once                      |
| `npm run test:watch`                  | Re-run tests as files change                      |
| `npm run typecheck`                   | TypeScript check with no output files             |
| `npm run validate`                    | Typecheck + lint + tests: run this before pushing |
| `npx jest __tests__/lib/time.test.ts` | Run a single test file                            |

Tests live in `__tests__/` (`lib/` for pure logic, `hooks/` for hooks); shared test data is in `__tests__/fixtures/`.

### Build and deploy

| Command                | What it does                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build:web`    | Export the static web build to `dist/`                                                                                          |
| `npx expo serve`       | Serve the exported `dist/` locally to check the production build                                                                |
| `git push origin main` | Deploys to Vercel. The Vercel build runs `npm run validate` first, so a failing test, type error or lint error stops the deploy |

### Pre-commit check

`.githooks/pre-commit` runs `npm run validate` and blocks the commit if the typecheck, lint or tests fail. Enable it once per clone:

```sh
git config core.hooksPath .githooks
```

Bypass it in an emergency with `git commit --no-verify`.

### Dependencies

| Command                      | What it does                                               |
| ---------------------------- | ---------------------------------------------------------- |
| `npx expo install <package>` | Add a package at the version compatible with this Expo SDK |
| `npx expo install --check`   | Check installed packages match the Expo SDK                |
