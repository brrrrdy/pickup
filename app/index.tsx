import { View } from "react-native";
import { Link, useRouter } from "expo-router";
import Logo from "../components/common/Logo";
import StartGameButton from "../components/buttons/StartGameButton";
import FindGameButton from "../components/buttons/FindGameButton";
import PageContent from "../components/layout/PageContent";
import PageLayout from "../components/layout/PageLayout";

export default function Landing() {
  const router = useRouter();

  return (
    <PageLayout fillViewport>
      <PageContent
        className="items-center justify-start"
        style={{ minHeight: "100%" }}
      >
        <View className="w-full items-center justify-start pt-4">
          <Logo />
          <View className="flex-row gap-4 mt-4">
            <StartGameButton onPress={() => router.push("/start-game")} />
            <FindGameButton onPress={() => router.push("/find-game")} />
          </View>
        </View>
      </PageContent>
    </PageLayout>
  );
}
