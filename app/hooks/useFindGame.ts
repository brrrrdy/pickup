import { useCallback, useMemo, useState } from "react";
import type {
  MatchCardData,
  SportOption,
} from "../../components/types/findGame";
import mockFindSportData from "../../mockdata/find-sport-data.json";
import {
  mapOpenMatchesForSelectedSports,
  mapSportsWithOpenGameCounts,
} from "../../mockdata/mapFindSports";

function isValidLocation(value: string) {
  return value.trim().length >= 2;
}

export default function useFindGame() {
  const [location, setLocation] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showGames, setShowGames] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const validLocations = useMemo(
    () =>
      Array.from(
        new Set(
          (mockFindSportData.venues ?? [])
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
      hasLocation
        ? mapSportsWithOpenGameCounts(mockFindSportData, location)
        : [],
    [hasLocation, location],
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
    const normalizedLocation = locationInput.trim();

    if (!isValidLocation(normalizedLocation)) {
      setShowLocationSuggestions(false);
      clearActiveSearch();
      return;
    }

    setLocation(normalizedLocation);
    setShowLocationSuggestions(false);
  }, [clearActiveSearch, locationInput]);

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
            mockFindSportData,
            selectedSports,
            location,
          )
        : [],
    [hasLocation, location, selectedSports],
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
