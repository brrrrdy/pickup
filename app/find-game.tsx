import RequireAuth from "../lib/auth/RequireAuth";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import PageShell, { PageShellBody } from "../components/layout/PageShell";
import PageSection from "../components/layout/PageSection";
import findAGameContent from "../content/findagame.json";
import LocationSearchBar from "../components/LocationSearchBar";
import SportSearch from "../components/SportSearch";
import MatchList from "../components/common/MatchList";
import useFindGame from "../hooks/use-find-game";
import { useMatches } from "../hooks/use-matches";
import { fetchCityNames } from "../lib/matches/api";
import type { MatchSummary } from "../types/find-game";

const content = findAGameContent.en;

function FindGame() {
  const { matches, error, reload } = useMatches("upcoming");
  const [cities, setCities] = useState<string[] | null>(null);
  const [citiesError, setCitiesError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchCityNames()
      .then((names) => isMounted && setCities(names))
      .catch(
        (err: unknown) =>
          isMounted &&
          setCitiesError(err instanceof Error ? err.message : String(err)),
      );
    return () => {
      isMounted = false;
    };
  }, []);

  const loadError = error ?? citiesError;

  return (
    <PageShell>
      <PageShellBody className="max-w-5xl gap-4">
        {loadError ? (
          <Text className="w-full max-w-4xl text-left text-sm font-sans text-defaulttext">
            {content.loadError} {loadError}
          </Text>
        ) : !matches || !cities ? (
          <Text className="w-full max-w-4xl text-left text-sm font-sans text-defaulttext/70">
            {content.loading}
          </Text>
        ) : (
          <FindGameSearch
            cities={cities}
            matches={matches}
            onChanged={reload}
          />
        )}
      </PageShellBody>
    </PageShell>
  );
}

function FindGameSearch({
  cities,
  matches,
  onChanged,
}: {
  cities: string[];
  matches: MatchSummary[];
  onChanged: () => void;
}) {
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
  } = useFindGame({ cities, matches });

  return (
    <>
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
                hasSearched={showGames}
                emptyMessage={content.noOpenGamesForSelectedSports}
                onChanged={onChanged}
              />
            </>
          ) : (
            <Text className="w-full max-w-4xl text-left text-sm font-sans text-defaulttext">
              {content.noOpenGamesInLocationPrefix} {location}.
            </Text>
          )}
        </PageSection>
      ) : null}
    </>
  );
}

export default function FindGamePage() {
  return (
    <RequireAuth>
      <FindGame />
    </RequireAuth>
  );
}
