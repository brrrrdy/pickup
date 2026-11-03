import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { SplashScreen } from "expo-router";
import "../global.css";
import AppShell from "../components/layout/AppShell";
import { Uniwind } from "uniwind";
import { loadThemePreference } from "../lib/theme/theme-preference";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    GoogleSans: require("../assets/fonts/GoogleSans.ttf"),
    ContrailOne: require("../assets/fonts/ContrailOne-Regular.ttf"),
  });
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    loadThemePreference().then((theme) => {
      Uniwind.setTheme(theme);
      setThemeReady(true);
    });
  }, []);

  useEffect(() => {
    if ((loaded || error) && themeReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, themeReady]);

  if ((!loaded && !error) || !themeReady) {
    return null;
  }

  return (
    <AppShell>
      <Slot />
    </AppShell>
  );
}
