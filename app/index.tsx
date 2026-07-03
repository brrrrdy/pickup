import { View } from "react-native";
import { Link, useRouter } from "expo-router";
import Logo from "../components/common/Logo";
import StartGameButton from "../components/buttons/StartGameButton";
import FindGameButton from "../components/buttons/FindGameButton";
import PageContent from "../components/layout/PageContent";
import PageLayout from "../components/layout/PageLayout";
import { PageBody } from "../components/typography/Typography";

export default function Landing() {
  const router = useRouter();

  return (
    <PageLayout>
      <PageContent className="items-center justify-center">
        <View className="w-full items-center mt-5">
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
