import type { MatchSummary } from "../../types/find-game";

/** e.g. "Tue 24 Nov, 20:00", in the venue's timezone. */
export function formatMatchTime(startsAt: string, timeZone: string) {
  const date = new Date(startsAt);

  if (Number.isNaN(date.getTime())) {
    return startsAt;
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatMatchLocation(match: MatchSummary) {
  return `${match.venueName}, ${match.cityName}`;
}

/** e.g. "2 / 4 players" or "3 players" when there is no limit. */
export function formatPlayerCount(match: MatchSummary) {
  return match.maxPlayers === null
    ? `${match.playerCount} players`
    : `${match.playerCount} / ${match.maxPlayers} players`;
}

export function isMatchFull(match: MatchSummary) {
  return match.maxPlayers !== null && match.playerCount >= match.maxPlayers;
}
