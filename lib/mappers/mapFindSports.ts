import type {
  AttendingMatchDisplay,
  FindSportMockData,
  MatchCardData,
  MatchRow,
  SportOption,
  SportRow,
  VenueRow,
} from "../../components/types/find-game";

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

function formatMatchDateTime(startsAt: string) {
  const date = new Date(startsAt);

  if (Number.isNaN(date.getTime())) {
    return startsAt;
  }

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function mapAttendingMatchesByTime(
  data: FindSportMockData,
  timing: "future" | "past",
): AttendingMatchDisplay[] {
  const sportsRows = (data.sports ?? []) as SportRow[];
  const venueRows = (data.venues ?? []) as VenueRow[];
  const matchRows = (data.matches ?? []) as MatchRow[];
  const now = Date.now();

  const sportNameById = new Map(
    sportsRows.map((sport) => [sport.id, sport.sportname ?? "unknown sport"]),
  );

  const venueById = new Map(
    venueRows.map((venue) => [
      venue.id,
      {
        venueName: venue.venuename ?? "unknown venue",
        city: venue.city ?? "unknown city",
      },
    ]),
  );

  return matchRows
    .filter((match) => match.Attend === "y" && Boolean(match.starts_at))
    .filter((match) => {
      const startsAtMillis = new Date(match.starts_at as string).getTime();

      if (Number.isNaN(startsAtMillis)) {
        return false;
      }

      return timing === "future" ? startsAtMillis >= now : startsAtMillis < now;
    })
    .sort((a, b) => {
      const aMillis = new Date(a.starts_at as string).getTime();
      const bMillis = new Date(b.starts_at as string).getTime();
      return timing === "future" ? aMillis - bMillis : bMillis - aMillis;
    })
    .map((match) => {
      const venue = match.venue_id ? venueById.get(match.venue_id) : undefined;

      return {
        id: match.id,
        sportName: sportNameById.get(match.sport_id ?? "") ?? "unknown sport",
        title: match.title ?? "open game",
        startsAt: match.starts_at as string,
        displayDateTime: formatMatchDateTime(match.starts_at as string),
        location: venue
          ? `${venue.venueName}, ${venue.city}`
          : "unknown location",
      };
    });
}