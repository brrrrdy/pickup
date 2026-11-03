import AsyncStorage from "@react-native-async-storage/async-storage";
import { Uniwind } from "uniwind";

export type ThemePreference = "light" | "dark";

const STORAGE_KEY = "pickup.theme";

export async function loadThemePreference(): Promise<ThemePreference> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function setThemePreference(theme: ThemePreference) {
  Uniwind.setTheme(theme);
  AsyncStorage.setItem(STORAGE_KEY, theme).catch(() => {});
}
