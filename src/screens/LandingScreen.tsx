import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

import { DevUserPicker } from "../components/DevUserPicker";
import { FindGameButton } from "../components/FindGameButton";
import { StartGameButton } from "../components/StartGameButton";
import type { DevUser } from "../types/user";

type LandingScreenProps = {
  currentUser: DevUser;
  users: DevUser[];
  onUserChange: (userId: string) => void;
  onFindGamePress?: () => void;
  onStartGamePress?: () => void;
};

export function LandingScreen({
  currentUser,
  users,
  onUserChange,
  onFindGamePress,
  onStartGamePress,
}: LandingScreenProps) {
  return (
    <View className="flex-1 justify-between bg-background px-6 pb-12 pt-[88px]">
      <StatusBar style="dark" />

      <View className="mt-6 items-center">
        <Text className="mb-2.5 text-[82px] font-extrabold italic text-primary">
          pickup
        </Text>
        <Text className="max-w-[290px] text-center text-[16px] leading-6 text-muted">
          find casual local sports games in minutes.
        </Text>

        <View className="mt-6 w-full max-w-[320px] self-center">
          <DevUserPicker
            users={users}
            selectedUserId={currentUser.id}
            onChange={onUserChange}
          />
        </View>
      </View>

      <View className="gap-3.5">
        <FindGameButton onPress={onFindGamePress} />
        <StartGameButton onPress={onStartGamePress} />

        <View className="min-h-[56px] items-center justify-center rounded-[14px] bg-accentblue">
          <Text className="text-[17px] font-bold text-primary">
            register or log in
          </Text>
        </View>
      </View>
    </View>
  );
}
