import { ScrollView, Text, View } from "react-native";
import { PageBody, PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";
import PageSection from "../components/layout/PageSection";
import findAGameContent from "../content/findagame.json";
import LocationSearchBar from "../components/LocationSearchBar";
import SportSearch from "../components/SportSearch";
import MatchList from "../components/common/MatchList";
import useFindGame from "./hooks/use-find-game";

export default function FindGame() {
  const content = findAGameContent.en;

  const {
    hasLocation,
    location,
    locationInput,
    setLocationInput,
    locationSuggestions,
    showLocationSuggestions,
    commitLocation,
    selectLocationSuggestion,
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
            <PageHeader>{content.header}</PageHeader>
            <PageBody className="mt-2 text-defaulttext/80">
              {content.body}
            </PageBody>
          </PageSection>

          <PageSection>
            <LocationSearchBar
              value={locationInput}
              onChangeText={setLocationInput}
              suggestions={locationSuggestions}
              showSuggestions={showLocationSuggestions}
              onSelectSuggestion={selectLocationSuggestion}
              placeholder={content.locationPlaceholder}
              suggestionA11yPrefix={content.locationSuggestionA11yPrefix}
              onSubmitEditing={commitLocation}
              onBlur={commitLocation}
            />
          </PageSection>

          {hasLocation ? (
            <PageSection className="gap-4">
              {availableSports.length > 0 ? (
                <>
                  <SportSearch
                    location={location}
                    sports={availableSports}
                    selectedIds={selectedIds}
                    onToggleSport={toggleSport}
                    onShowGames={handleShowGames}
                    availableGamesInPrefix={content.availableGamesInPrefix}
                    availableGamesInFallback={content.availableGamesInFallback}
                    showGamesButtonLabel={content.showGamesButton}
                  />

                  <MatchList
                    matches={openMatches}
                    location={location}
                    hasSearched={showGames}
                    emptyMessage={content.noOpenGamesForSelectedSports}
                  />
                </>
              ) : (
                <Text className="w-full max-w-xl text-left text-sm text-defaulttext">
                  {content.noOpenGamesInLocationPrefix} {location}.
                </Text>
              )}
            </PageSection>
          ) : null}
        </View>
      </ScrollView>
    </PageContent>
  );
}
