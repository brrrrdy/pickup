import { useCSSVariable } from "uniwind";
import { THEME_COLORS } from "./colors";

type ThemeColorName = keyof typeof THEME_COLORS;

// Resolves a theme color for JS-only props (placeholderTextColor, Switch, Svg fill)
// so it follows the active light/dark theme.
export function useThemeColor(name: ThemeColorName): string {
  const value = useCSSVariable(`--color-${name}`);

  return typeof value === "string" ? value : THEME_COLORS[name];
}
