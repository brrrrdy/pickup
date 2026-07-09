import { useRef } from "react";
import { ScrollView, View } from "react-native";
import StartGameCard from "../components/common/StartGameCard";
import PageSection from "../components/layout/PageSection";
import PageContent from "../components/layout/PageContent";
import PageLayout from "../components/layout/PageLayout";

export default function StartGame() {
  const scrollRef = useRef<ScrollView>(null);

  const handleResetToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <PageLayout ref={scrollRef}>
      <PageContent className="px-4 pt-6">
        <View className="w-full gap-4">
          <PageSection className="items-center">
            <StartGameCard onResetToTop={handleResetToTop} />
          </PageSection>
        </View>
      </PageContent>
    </PageLayout>
  );
}
