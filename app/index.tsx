// app/index.tsx

import { Text, View } from "react-native";
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
  const roadmapWord = "roadmap";
  const hasRoadmap = content.heroSubText.includes(roadmapWord);
  const [beforeRoadmap, afterRoadmap = ""] = hasRoadmap
    ? content.heroSubText.split(roadmapWord)
    : [content.heroSubText, ""];

  return (
    <PageShell>
      <PageShellBody className="items-center justify-start pt-0 gap-2">
        <Logo />
        <View className="w-full my-1">
          <HeroBanner />
        </View>
        <View className="mt-5 max-w-[92%] self-center border-4 border-dashed border-redaccent! bg-secondary px-4 py-3">
          <PageSmall
            className="text-center"
            style={{ fontFamily: "ContrailOne" }}
          >
            {hasRoadmap ? (
              <>
                {beforeRoadmap}
                <Text
                  className="underline text-purpleaccent"
                  accessibilityRole="link"
                  onPress={() => router.push("/about")}
                >
                  {roadmapWord}
                </Text>
                {afterRoadmap}
              </>
            ) : (
              content.heroSubText
            )}
          </PageSmall>
        </View>
        <View className="flex-row gap-4">
          <StartGameButton onPress={() => router.push("/start-game")} />
          <FindGameButton onPress={() => router.push("/find-game")} />
        </View>
      </PageShellBody>
    </PageShell>
  );
}
