import type { StartGameOptions } from "../../types/find-game";

export const DURATION_OPTIONS = ["60", "90", "120"];
export const DEFAULT_DURATION = "90";
export const DEFAULT_TIMEZONE = "Europe/Madrid";

export function getSportNames(data: StartGameOptions) {
  return data.sports.map((sport) => sport.name);
}

export function getCityNames(data: StartGameOptions) {
  return data.cities.map((city) => city.name);
}

export function findSport(data: StartGameOptions, name: string) {
  return data.sports.find((sport) => sport.name === name);
}

export function findCity(data: StartGameOptions, name: string) {
  return data.cities.find((city) => city.name === name);
}

export function getVenuesFor(
  data: StartGameOptions,
  cityId: string | undefined,
  sportId: string | undefined,
) {
  if (!cityId || !sportId) {
    return [];
  }

  return data.venues.filter(
    (venue) => venue.cityId === cityId && venue.sportIds.includes(sportId),
  );
}
