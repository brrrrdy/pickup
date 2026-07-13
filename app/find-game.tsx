import { Text, View } from "react-native";
import PageShell, { PageShellBody } from "../components/layout/PageShell";
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
    <PageShell>
      <PageShellBody className="max-w-5xl gap-4">
        <PageSection className="items-center">
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
          <PageSection className="items-center gap-4">
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
              <Text className="w-full max-w-4xl text-left text-sm text-defaulttext">
                {content.noOpenGamesInLocationPrefix} {location}.
              </Text>
            )}
          </PageSection>
        ) : null}
      </PageShellBody>
    </PageShell>
  );
}
