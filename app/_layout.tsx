import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import "../global.css";
import AppShell from "../components/layout/AppShell";
import { Uniwind } from "uniwind";
import { AuthProvider, useAuth } from "../lib/auth/AuthProvider";
import { loadThemePreference } from "../lib/theme/theme-preference";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootContent />
    </AuthProvider>
  );
}

function RootContent() {
  const [loaded, error] = useFonts({
    GoogleSans: require("../assets/fonts/GoogleSans.ttf"),
    ContrailOne: require("../assets/fonts/ContrailOne-Regular.ttf"),
  });
  const [themeReady, setThemeReady] = useState(false);
  const { isLoading: authLoading } = useAuth();

  useEffect(() => {
    loadThemePreference().then((theme) => {
      Uniwind.setTheme(theme);
      setThemeReady(true);
    });
  }, []);

  const ready = (loaded || error) && themeReady && !authLoading;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <AppShell>
      <Slot />
    </AppShell>
  );
}
