import { ScrollView, View } from "react-native";
import { PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";
import PageSection from "../components/layout/PageSection";
import LocationSearchBar from "../components/LocationSearch";
import SportSearch from "../components/SportSearch";
import MatchList from "../components/common/MatchList";
import useFindGame from "./hooks/useFindGame";

export default function FindGame() {
  const {
    location,
    setLocation,
    availableSports,
    selectedIds,
    toggleSport,
    showGames,
    handleShowGames,
    openMatches,
  } = useFindGame();

  return (
    <PageContent className="w-full px-4 pt-6">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full gap-4">
          <PageSection>
            <PageHeader>find a game</PageHeader>
          </PageSection>

          <PageSection>
            <LocationSearchBar value={location} onChangeText={setLocation} />
          </PageSection>

          <PageSection className="gap-4 px-4">
            <SportSearch
              location={location}
              sports={availableSports}
              selectedIds={selectedIds}
              onToggleSport={toggleSport}
              onShowGames={handleShowGames}
            />

            <MatchList
              matches={openMatches}
              location={location}
              hasSearched={showGames}
            />
          </PageSection>
        </View>
      </ScrollView>
    </PageContent>
  );
}
