import { Slot } from "expo-router";
import "../global.css";
import AppShell from "../components/layout/AppShell";

export default function RootLayout() {
  return (
    <AppShell>
      <Slot />
    </AppShell>
  );
}
