import { View } from "react-native";
import Logo from "../components/common/Logo";
import StartGameButton from "../components/buttons/StartGameButton";
import FindGameButton from "../components/buttons/FindGameButton";
import PageContent from "../components/layout/PageContent";

export default function Landing() {
  return (
    <PageContent className="items-center justify-center">
      <Logo />
      <View className="flex-row gap-4">
        <StartGameButton />
        <FindGameButton />
      </View>
    </PageContent>
  );
}
