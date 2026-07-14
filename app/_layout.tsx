import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { SplashScreen } from "expo-router";
import "../global.css";
import AppShell from "../components/layout/AppShell";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    GoogleSans: require("../assets/fonts/GoogleSans.ttf"),
    ContrailOne: require("../assets/fonts/ContrailOne-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AppShell>
      <Slot />
    </AppShell>
  );
}
