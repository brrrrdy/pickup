import { Text, View } from "react-native";
import Logo from "../components/common/Logo";
import StartGameButton from "../components/buttons/StartGameButton";
import FindGameButton from "../components/buttons/FindGameButton";

export default function Landing() {
  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <Logo />
      <View className="flex-row gap-4">
        <StartGameButton />
        <FindGameButton />
      </View>
    </View>
  );
}
