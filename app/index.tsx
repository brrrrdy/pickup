import { Text, View } from "react-native";
import StartGameButton from "../components/buttons/StartGameButton";
import FindGameButton from "../components/buttons/FindGameButton";

export default function Landing() {
  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <Text className="text-2xl text-defaulttext">Pickup</Text>
      <StartGameButton />
      <FindGameButton />
    </View>
  );
}
