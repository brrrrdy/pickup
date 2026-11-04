import { useCallback, useMemo, useState } from "react";
import type { MatchSummary } from "../types/find-game";
import { getGamesForSports, getSportsWithGames } from "../lib/find-game/filter";

// user entered location is valid when over two charactters.

function isValidLocation(value: string) {
  return value.trim().length >= 2;
}

/**
 * attempts to resolve a raw location input string to a known city name.
 * resolution priority:
 *   1. exact match (case-insensitive)
 *   2. single prefix match
 *   3. single contains match
 * returns null if the input is too short or ambiguous.
 */

function resolveLocationInput(validLocations: string[], input: string) {
  const normalizedInput = input.trim().toLowerCase();

  if (!isValidLocation(normalizedInput)) {
    return null;
  }

  const exactMatch = validLocations.find(
    (cityName) => cityName.toLowerCase() === normalizedInput,
  );

  if (exactMatch) {
    return exactMatch;
  }

  const prefixMatches = validLocations.filter((cityName) =>
    cityName.toLowerCase().startsWith(normalizedInput),
  );

  if (prefixMatches.length === 1) {
    return prefixMatches[0];
  }

  const containsMatches = validLocations.filter((cityName) =>
    cityName.toLowerCase().includes(normalizedInput),
  );

  if (containsMatches.length === 1) {
    return containsMatches[0];
  }

  // input is unrecognised

  return null;
}

/**
 * manages all state and logic for the Find Game screen.
 *
 *   1. user types a location → suggestions appear → user commits a location
 *   2. available sports are derived from the committed location
 *   3. user toggles sports → open matches are filtered accordingly
 *   4. user presses "show games" → match results are displayed
 */

type UseFindGameParams = {
  // every city pickup knows about
  cities: string[];
  // upcoming scheduled matches
  matches: MatchSummary[];
};

export default function useFindGame({ cities, matches }: UseFindGameParams) {
  // locationInput: raw value of the text input (may not be a valid city)
  // location: the committed, validated city name used for filtering
  // with only one city, it starts committed so there is nothing to type.

  const onlyCity = cities.length === 1 ? cities[0] : "";
  const [location, setLocation] = useState(onlyCity);
  const [locationInput, setLocationInput] = useState(onlyCity);

  // ids of sports the user has toggled on

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // whether match results are visible

  const [showGames, setShowGames] = useState(false);
  // whether the location suggestion dropdown is open
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  // unique city names extracted from venue data

  const validLocations = cities;

  const hasLocation = useMemo(() => isValidLocation(location), [location]);

  // suggestions shown beneath the location input while the user is typing.
  // hidden once a location is committed or input is too short.

  const locationSuggestions = useMemo(() => {
    const normalizedInput = locationInput.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();
    // dont re-show suggestions if the input already matches the committed location
    if (!showLocationSuggestions || normalizedInput.length <= 2) {
      return [];
    }

    if (hasLocation && normalizedInput === normalizedLocation) {
      return [];
    }

    return validLocations.filter((cityName) =>
      cityName.toLowerCase().includes(normalizedInput),
    );
  }, [
    hasLocation,
    location,
    locationInput,
    showLocationSuggestions,
    validLocations,
  ]);

  const resolvedLocationInput = useMemo(
    () => resolveLocationInput(validLocations, locationInput),
    [locationInput, validLocations],
  );

  // sports available at the committed location, with open game counts

  const availableSports = useMemo(
    () => (hasLocation ? getSportsWithGames(matches, location) : []),
    [hasLocation, location, matches],
  );

  // subset of availableSports the user has selected

  const selectedSports = useMemo(
    () => availableSports.filter((sport) => selectedIds.includes(sport.id)),
    [availableSports, selectedIds],
  );

  // toggle a sport on or off. Hides results until the user re-triggers search.

  const toggleSport = useCallback((sportId: string) => {
    setSelectedIds((prev) =>
      prev.includes(sportId)
        ? prev.filter((id) => id !== sportId)
        : [...prev, sportId],
    );

    setShowGames(false);
  }, []);

  // reveals match results — no-op if no valid location is committed

  const handleShowGames = useCallback(() => {
    if (!hasLocation) {
      return;
    }

    setShowGames(true);
  }, [hasLocation]);

  // resets location, sport selection, and results without clearing the input

  const clearActiveSearch = useCallback(() => {
    setLocation("");
    setSelectedIds([]);
    setShowGames(false);
  }, []);

  // handles every keystroke in the location input. shows suggestions after 2 characters and clears the active search if the user edits away from the committed location.

  const handleLocationInputChange = useCallback(
    (nextLocation: string) => {
      setLocationInput(nextLocation);
      setShowLocationSuggestions(nextLocation.trim().length > 2);

      if (nextLocation.trim() !== location) {
        clearActiveSearch();
      }
    },
    [clearActiveSearch, location],
  );

  // called when the user blurs the input or presses enter. attempts to resolve the raw input to a known city name.

  const commitLocation = useCallback(() => {
    const resolvedLocation = resolvedLocationInput;

    if (!resolvedLocation) {
      setShowLocationSuggestions(false);
      clearActiveSearch();
      return;
    }

    setLocationInput(resolvedLocation);
    setLocation(resolvedLocation);
    setShowLocationSuggestions(false);
  }, [clearActiveSearch, resolvedLocationInput]);

  // called when the user taps a suggestion from the dropdown. immediately commits the selection and closes suggestions.

  const handleSelectLocationSuggestion = useCallback(
    (selectedLocation: string) => {
      setLocationInput(selectedLocation);
      setLocation(selectedLocation);
      setSelectedIds([]);
      setShowGames(false);
      setShowLocationSuggestions(false);
    },
    [],
  );

  // open matches filtered by committed location and selected sports

  const openMatches: MatchSummary[] = useMemo(
    () =>
      hasLocation
        ? getGamesForSports(
            matches,
            location,
            selectedSports.map((sport) => sport.id),
          )
        : [],
    [hasLocation, location, matches, selectedSports],
  );

  return {
    hasLocation,
    location,
    locationInput,
    setLocationInput: handleLocationInputChange,
    locationSuggestions,
    showLocationSuggestions,
    commitLocation,
    selectLocationSuggestion: handleSelectLocationSuggestion,
    availableSports,
    selectedIds,
    toggleSport,
    showGames,
    handleShowGames,
    openMatches,
  };
}
