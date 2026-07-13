import { View } from "react-native";
import { useRouter } from "expo-router";
import Logo from "../components/common/Logo";
import StartGameButton from "../components/buttons/StartGameButton";
import FindGameButton from "../components/buttons/FindGameButton";
import PageShell, { PageShellBody } from "../components/layout/PageShell";

export default function Landing() {
  const router = useRouter();

  return (
    <PageShell>
      <PageShellBody className="items-center justify-start pt-4">
        <Logo />
        <View className="mt-4 flex-row gap-4">
          <StartGameButton onPress={() => router.push("/start-game")} />
          <FindGameButton onPress={() => router.push("/find-game")} />
        </View>
      </PageShellBody>
    </PageShell>
  );
}
