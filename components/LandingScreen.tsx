import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

import { FindGameButton } from "./FindGameButton";
import { StartGameButton } from "./StartGameButton";

export function LandingScreen() {
  return (
    <View className="flex-1 justify-between bg-surface px-6 pb-12 pt-[88px]">
      <StatusBar style="dark" />

      <View className="mt-6 items-center">
        <View className="mb-5 h-24 w-24 items-center justify-center rounded-full bg-primary">
          <Text className="text-[40px] font-extrabold tracking-[0.5px] text-primary-foreground">
            P
          </Text>
        </View>

        <Text className="mb-2.5 text-[42px] font-extrabold text-foreground">
          pickup
        </Text>
        <Text className="max-w-[290px] text-center text-[16px] leading-6 text-muted">
          Find casual local games in minutes.
        </Text>
      </View>

      <View className="gap-3.5">
        <FindGameButton />
        <StartGameButton />

        <View className="min-h-[56px] items-center justify-center rounded-[14px] border border-border bg-secondary">
          <Text className="text-[17px] font-bold text-foreground">
            Register / Log in
          </Text>
        </View>
      </View>
    </View>
  );
}
