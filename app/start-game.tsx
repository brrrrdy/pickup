import { useRef } from "react";
import { ScrollView, View } from "react-native";
import StartGameCard from "../components/common/StartGameCard";
import { PageBody, PageHeader } from "../components/typography/Typography";
import PageSection from "../components/layout/PageSection";
import PageContent from "../components/layout/PageContent";
import PageLayout from "../components/layout/PageLayout";
import startGameCardContent from "../content/startgamecard.json";

export default function StartGame() {
  const scrollRef = useRef<ScrollView>(null);
  const content = startGameCardContent.en;

  const handleResetToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <PageLayout ref={scrollRef}>
      <PageContent className="px-4 pt-6">
        <View className="w-full gap-4">
          <PageSection>
            <PageHeader>{content.cardheader}</PageHeader>
            <PageBody className="mt-2 text-defaulttext/80">
              {content.carddescrip}
            </PageBody>
          </PageSection>

          <PageSection>
            <StartGameCard onResetToTop={handleResetToTop} />
          </PageSection>
        </View>
      </PageContent>
    </PageLayout>
  );
}
