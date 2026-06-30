import { ScrollView, Text, View } from "react-native";
import { PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";
import PageSection from "../components/layout/PageSection";
import LocationSearchBar from "../components/LocationSearch";
import SportSearch from "../components/SportSearch";
import MatchList from "../components/common/MatchList";
import useFindGame from "./hooks/useFindGame";

export default function FindGame() {
  const {
    hasLocation,
    location,
    locationInput,
    setLocationInput,
    commitLocation,
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
            <LocationSearchBar
              value={locationInput}
              onChangeText={setLocationInput}
              onSubmitEditing={commitLocation}
              onBlur={commitLocation}
            />
          </PageSection>

          {hasLocation ? (
            <PageSection className="gap-4 px-4">
              {availableSports.length > 0 ? (
                <>
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
                </>
              ) : (
                <Text className="w-full max-w-xl text-left text-sm text-defaulttext">
                  no open games found in {location}.
                </Text>
              )}
            </PageSection>
          ) : null}
        </View>
      </ScrollView>
    </PageContent>
  );
}
