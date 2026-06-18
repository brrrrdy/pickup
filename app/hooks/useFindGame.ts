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

export default function useFindGame() {
  const [location, setLocation] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showGames, setShowGames] = useState(false);

  const availableSports = useMemo(
    () => mapSportsWithOpenGameCounts(mockFindSportData),
    [],
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
    setShowGames(true);
  }, []);

  const openMatches: MatchCardData[] = useMemo(
    () => mapOpenMatchesForSelectedSports(mockFindSportData, selectedSports),
    [selectedSports],
  );

  return {
    location,
    setLocation,
    availableSports,
    selectedIds,
    toggleSport,
    showGames,
    handleShowGames,
    openMatches,
  };
}
