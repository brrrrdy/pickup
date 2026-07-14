import { View } from "react-native";
import { useRouter } from "expo-router";
import home from "../content/home.json";
import Logo from "../components/common/Logo";
import HeroBanner from "../components/homepage/HeroBanner";
import StartGameButton from "../components/buttons/StartGameButton";
import FindGameButton from "../components/buttons/FindGameButton";
import PageShell, { PageShellBody } from "../components/layout/PageShell";
import { PageSmall } from "../components/typography/Typography";

export default function Landing() {
  const router = useRouter();
  const content = home.en;

  return (
    <PageShell>
      <PageShellBody className="items-center justify-start pt-0 gap-2">
        <Logo />
        <View className="w-full my-1">
          <HeroBanner />
        </View>
        <PageSmall className="w-full text-center mt-5">
          {content.heroSubText}
        </PageSmall>

        <View className="flex-row gap-4">
          <StartGameButton onPress={() => router.push("/start-game")} />
          <FindGameButton onPress={() => router.push("/find-game")} />
        </View>
      </PageShellBody>
    </PageShell>
  );
}
