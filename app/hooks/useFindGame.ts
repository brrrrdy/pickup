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

  const hasLocation = isValidLocation(location);

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

      if (nextLocation.trim() !== location) {
        clearActiveSearch();
      }
    },
    [clearActiveSearch, location],
  );

  const commitLocation = useCallback(() => {
    const normalizedLocation = locationInput.trim();

    if (!isValidLocation(normalizedLocation)) {
      clearActiveSearch();
      return;
    }

    setLocation(normalizedLocation);
  }, [clearActiveSearch, locationInput]);

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
    commitLocation,
    availableSports,
    selectedIds,
    toggleSport,
    showGames,
    handleShowGames,
    openMatches,
  };
}
