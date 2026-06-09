import { useState } from "react";

import { FindGameScreen } from "../screens/FindGameScreen";
import { LandingScreen } from "../screens/LandingScreen";

type RouteName = "landing" | "find-game";

export function RootNavigator() {
  const [route, setRoute] = useState<RouteName>("landing");

  if (route === "find-game") {
    return <FindGameScreen onBack={() => setRoute("landing")} />;
  }

  return <LandingScreen onFindGamePress={() => setRoute("find-game")} />;
}
