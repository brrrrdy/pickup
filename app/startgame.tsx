import { ScrollView } from "react-native";
import StartGameCard from "../components/common/StartGameCard";
import { PageBody, PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";

export default function StartGame() {
  return (
    <PageContent className="px-4 pt-6">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <StartGameCard />
      </ScrollView>
    </PageContent>
  );
}
