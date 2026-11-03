import AsyncStorage from "@react-native-async-storage/async-storage";
import { Uniwind } from "uniwind";

export type ThemePreference = "light" | "dark";
// "system" follows the device's light/dark setting (iOS, Android, macOS,
// Windows and the browser), including when it changes while the app is open.
export type StartupTheme = ThemePreference | "system";

const STORAGE_KEY = "pickup.theme";

// The theme the user picked with the dark mode switch, or "system" if they
// never picked one.
export async function loadThemePreference(): Promise<StartupTheme> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : "system";
  } catch {
    return "system";
  }
}

export function setThemePreference(theme: ThemePreference) {
  Uniwind.setTheme(theme);
  AsyncStorage.setItem(STORAGE_KEY, theme).catch(() => {});
}
