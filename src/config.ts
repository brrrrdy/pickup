// Set via environment variables at build time.
// For local dev, Expo exposes EXPO_PUBLIC_* variables from .env.local.
// Example .env.local: EXPO_PUBLIC_API_URL=http://localhost:4000
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";
