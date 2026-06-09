import { useState } from "react";

import { DEV_USERS } from "../data/devUsers";
import { FindGameScreen } from "../screens/FindGameScreen";
import { LandingScreen } from "../screens/LandingScreen";
import { StartGameScreen } from "../screens/StartGameScreen";

type RouteName = "landing" | "find-game" | "start-game";

export function RootNavigator() {
  const [route, setRoute] = useState<RouteName>("landing");
  const [currentUserId, setCurrentUserId] = useState(DEV_USERS[0]?.id ?? "");
  const currentUser =
    DEV_USERS.find((user) => user.id === currentUserId) ?? DEV_USERS[0];

  if (route === "find-game") {
    return (
      <FindGameScreen
        currentUser={currentUser}
        onBack={() => setRoute("landing")}
      />
    );
  }

  if (route === "start-game") {
    return (
      <StartGameScreen
        currentUser={currentUser}
        onCancel={() => setRoute("landing")}
      />
    );
  }

  return (
    <LandingScreen
      currentUser={currentUser}
      users={DEV_USERS}
      onUserChange={setCurrentUserId}
      onFindGamePress={() => setRoute("find-game")}
      onStartGamePress={() => setRoute("start-game")}
    />
  );
}
