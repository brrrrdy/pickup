import type {
  FindSportMockData,
  MatchCardData,
  MatchRow,
  SportOption,
  SportRow,
  VenueRow,
} from "../components/types/findGame";

function normalizeLocation(value: string) {
  return value.trim().split(",")[0]?.trim().toLowerCase() ?? "";
}

function getOpenMatchesForLocation(data: FindSportMockData, location: string) {
  const matchRows = (data.matches ?? []) as MatchRow[];
  const venueRows = (data.venues ?? []) as VenueRow[];
  const normalizedLocation = normalizeLocation(location);

  if (!normalizedLocation) {
    return [];
  }

  const venueIdsForLocation = new Set(
    venueRows
      .filter((venue) => normalizeLocation(venue.city) === normalizedLocation)
      .map((venue) => venue.id),
  );

  if (venueIdsForLocation.size === 0) {
    return [];
  }

  return matchRows.filter(
    (match) =>
      match.status === "open" &&
      match.venue_id !== null &&
      match.venue_id !== undefined &&
      venueIdsForLocation.has(match.venue_id),
  );
}

export function mapSportsWithOpenGameCounts(
  data: FindSportMockData,
  location: string,
): SportOption[] {
  const sportsRows = (data.sports ?? []) as SportRow[];
  const matchRows = getOpenMatchesForLocation(data, location);

  return sportsRows
    .map((sport) => ({
      id: sport.id,
      name: sport.sportname ?? "unknown sport",
      availableGames: matchRows.filter((match) => match.sport_id === sport.id)
        .length,
    }))
    .filter((sport) => sport.availableGames > 0);
}

export function mapOpenMatchesForSelectedSports(
  data: FindSportMockData,
  selectedSports: SportOption[],
  location: string,
): MatchCardData[] {
  const sportsRows = (data.sports ?? []) as SportRow[];
  const matchRows = getOpenMatchesForLocation(data, location);

  const selectedIds = new Set(selectedSports.map((sport) => sport.id));
  const sportNameById = new Map(
    sportsRows.map((sport) => [sport.id, sport.sportname ?? "unknown sport"]),
  );

  return matchRows
    .filter(
      (match) => match.sport_id !== null && selectedIds.has(match.sport_id),
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
