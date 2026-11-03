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
- `npm run validate`: typecheck + tests

# Important

Run `npm run validate` (typecheck + Jest) before every commit, and do not commit if it fails. This is what the Vercel build runs, and the `.githooks/pre-commit` hook enforces it.
