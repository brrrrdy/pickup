import { View } from "react-native";
import { useRouter } from "expo-router";
import Logo from "../components/common/Logo";
import StartGameButton from "../components/buttons/StartGameButton";
import FindGameButton from "../components/buttons/FindGameButton";
import PageContent from "../components/layout/PageContent";

export default function Landing() {
  const router = useRouter();

  return (
    <PageContent className="items-center justify-center">
      <Logo />
      <View className="flex-row gap-4">
        <StartGameButton onPress={() => router.push("/startgame")} />
        <FindGameButton onPress={() => router.push("/findgame")} />
      </View>
    </PageContent>
  );
}
