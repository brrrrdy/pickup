import { useCallback, useMemo, useState } from "react";
import type { FindSportMockData, MatchCardData } from "../../types/find-game";
import mockFindSportData from "../../mockdata/find-sport-data.json";
import {
  mapOpenMatchesForSelectedSports,
  mapSportsWithOpenGameCounts,
} from "../../lib/mappers/mapFindSports";

function isValidLocation(value: string) {
  return value.trim().length >= 2;
}

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

  return null;
}

export default function useFindGame() {
  const findSportData = mockFindSportData as FindSportMockData;

  const [location, setLocation] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showGames, setShowGames] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const validLocations = useMemo(
    () =>
      Array.from(
        new Set(
          (findSportData.venues ?? [])
            .map((venue) => venue.city.trim())
            .filter((cityName) => cityName.length > 0),
        ),
      ),
    [],
  );

  const hasLocation = isValidLocation(location);

  const locationSuggestions = useMemo(() => {
    const normalizedInput = locationInput.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();

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

  const availableSports = useMemo(
    () =>
      hasLocation ? mapSportsWithOpenGameCounts(findSportData, location) : [],
    [findSportData, hasLocation, location],
  );

  const selectedSports = useMemo(
    () => availableSports.filter((sport) => selectedIds.includes(sport.id)),
    [availableSports, selectedIds],
  );

  const toggleSport = useCallback((sportId: string) => {
    setSelectedIds((prev) =>
      prev.includes(sportId)
        ? prev.filter((id) => id !== sportId)
        : [...prev, sportId],
    );

    setShowGames(false);
  }, []);

  const handleShowGames = useCallback(() => {
    if (!hasLocation) {
      return;
    }

    setShowGames(true);
  }, [hasLocation]);

  const clearActiveSearch = useCallback(() => {
    setLocation("");
    setSelectedIds([]);
    setShowGames(false);
  }, []);

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

  const commitLocation = useCallback(() => {
    const resolvedLocation = resolveLocationInput(
      validLocations,
      locationInput,
    );

    if (!resolvedLocation) {
      setShowLocationSuggestions(false);
      clearActiveSearch();
      return;
    }

    setLocationInput(resolvedLocation);
    setLocation(resolvedLocation);
    setShowLocationSuggestions(false);
  }, [clearActiveSearch, locationInput, validLocations]);

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

  const openMatches: MatchCardData[] = useMemo(
    () =>
      hasLocation
        ? mapOpenMatchesForSelectedSports(
            findSportData,
            selectedSports,
            location,
          )
        : [],
    [findSportData, hasLocation, location, selectedSports],
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
