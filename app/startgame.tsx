import { useRef } from "react";
import { ScrollView } from "react-native";
import StartGameCard from "../components/common/StartGameCard";
import { PageBody, PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";

export default function StartGame() {
  const scrollRef = useRef<ScrollView>(null);

  const handleResetToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <PageContent className="px-4 pt-6">
      <ScrollView
        ref={scrollRef}
        className="w-full"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <StartGameCard onResetToTop={handleResetToTop} />
      </ScrollView>
    </PageContent>
  );
}
