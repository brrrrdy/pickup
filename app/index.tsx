import { View } from "react-native";
import { useRouter } from "expo-router";
import Logo from "../components/common/Logo";
import StartGameButton from "../components/buttons/StartGameButton";
import FindGameButton from "../components/buttons/FindGameButton";
import RegisterButton from "../components/buttons/RegisterButton";
import PageContent from "../components/layout/PageContent";
import PageLayout from "../components/layout/PageLayout";

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
        <View className="mt-auto w-full items-center pt-4">
          <RegisterButton />
        </View>
      </PageContent>
    </PageLayout>
  );
}
