import type { FindSportMockData } from "../../types/find-game";

export function getValidSports(data: FindSportMockData) {
  return (data.sports ?? [])
    .map((sportRow) => sportRow.sportname?.trim() ?? "")
    .filter((sportName) => sportName.length > 0);
}

export function getValidCities(data: FindSportMockData) {
  return Array.from(
    new Set(
      (data.venues ?? [])
        .map((venueRow) => venueRow.city.trim())
        .filter((cityName) => cityName.length > 0),
    ),
  );
}

export function getSportIdByName(data: FindSportMockData, sportName: string) {
  const sportIdByName = new Map(
    (data.sports ?? [])
      .filter((sportRow) => sportRow.sportname)
      .map((sportRow) => [sportRow.sportname?.trim() ?? "", sportRow.id]),
  );

  return sportIdByName.get(sportName) ?? "";
}

export function getValidVenues(
  data: FindSportMockData,
  city: string,
  selectedSportId: string,
) {
  const venueSportIdsByVenueId = new Map(
    (data.venues ?? []).map((venueRow) => [
      venueRow.id,
      (venueRow.sport_ids ?? []).filter((sportId) => sportId.length > 0),
    ]),
  );

  const venueIdsForSelectedSport = new Set(
    (data.venues ?? [])
      .filter((venueRow) => {
        const configuredSportIds =
          venueSportIdsByVenueId.get(venueRow.id) ?? [];

        if (configuredSportIds.length > 0) {
          return configuredSportIds.includes(selectedSportId);
        }

        return (data.matches ?? []).some(
          (matchRow) =>
            matchRow.venue_id === venueRow.id &&
            matchRow.sport_id === selectedSportId,
        );
      })
      .map((venueRow) => venueRow.id),
  );

  return (data.venues ?? [])
    .filter(
      (venueRow) =>
        venueRow.city === city && venueIdsForSelectedSport.has(venueRow.id),
    )
    .map((venueRow) => venueRow.venuename?.trim() ?? "")
    .filter((venueName) => venueName.length > 0);
}
