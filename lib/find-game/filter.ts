import type { MatchSummary, SportOption } from "../../types/find-game";

function normalizeCity(value: string) {
  return value.trim().split(",")[0]?.trim().toLowerCase() ?? "";
}

export function getMatchesInCity(matches: MatchSummary[], city: string) {
  const target = normalizeCity(city);

  if (!target) {
    return [];
  }

  return matches.filter((match) => normalizeCity(match.cityName) === target);
}

/** Sports with at least one upcoming game in the city, with their counts. */
export function getSportsWithGames(
  matches: MatchSummary[],
  city: string,
): SportOption[] {
  const counts = new Map<string, SportOption>();

  for (const match of getMatchesInCity(matches, city)) {
    const existing = counts.get(match.sportId);
    if (existing) {
      existing.availableGames += 1;
    } else {
      counts.set(match.sportId, {
        id: match.sportId,
        name: match.sportName,
        availableGames: 1,
      });
    }
  }

  return Array.from(counts.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

/** Games in the city for the selected sports, soonest first. */
export function getGamesForSports(
  matches: MatchSummary[],
  city: string,
  sportIds: string[],
) {
  return getMatchesInCity(matches, city)
    .filter((match) => sportIds.includes(match.sportId))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
