import type {
  FindSportMockData,
  MatchCardData,
  MatchRow,
  SportOption,
  SportRow,
} from "../components/types/findGame";

export function mapSportsWithOpenGameCounts(
  data: FindSportMockData,
): SportOption[] {
  const sportsRows = (data.sports ?? []) as SportRow[];
  const matchRows = (data.matches ?? []) as MatchRow[];

  return sportsRows.map((sport) => ({
    id: sport.id,
    name: sport.sportname ?? "unknown sport",
    availableGames: matchRows.filter(
      (match) => match.sport_id === sport.id && match.status === "open",
    ).length,
  }));
}

export function mapOpenMatchesForSelectedSports(
  data: FindSportMockData,
  selectedSports: SportOption[],
): MatchCardData[] {
  const sportsRows = (data.sports ?? []) as SportRow[];
  const matchRows = (data.matches ?? []) as MatchRow[];

  const selectedIds = new Set(selectedSports.map((sport) => sport.id));
  const sportNameById = new Map(
    sportsRows.map((sport) => [sport.id, sport.sportname ?? "unknown sport"]),
  );

  return matchRows
    .filter(
      (match) =>
        match.status === "open" &&
        match.sport_id !== null &&
        selectedIds.has(match.sport_id),
    )
    .map((match) => ({
      id: match.id,
      sportName: sportNameById.get(match.sport_id ?? "") ?? "unknown sport",
      title: match.title ?? "open game",
      startsAt: match.starts_at ?? "tbd",
      durationMinutes: match.duration_minutes ?? 0,
    }))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
