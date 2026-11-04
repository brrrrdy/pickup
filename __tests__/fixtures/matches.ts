import type { MatchSummary } from "../../types/find-game";

export function makeMatch(overrides: Partial<MatchSummary>): MatchSummary {
  return {
    id: "m",
    sportId: "sport-padel",
    sportName: "Padel",
    venueName: "Lemos Padel",
    cityName: "Monforte de Lemos",
    timezone: "Europe/Madrid",
    startsAt: "2026-11-24T19:00:00+00:00",
    durationMinutes: 90,
    maxPlayers: 4,
    playerCount: 1,
    notes: null,
    hostName: "Ana",
    isHost: false,
    hasJoined: false,
    ...overrides,
  };
}

export const upcomingMatches: MatchSummary[] = [
  makeMatch({ id: "padel-late", startsAt: "2026-11-24T19:00:00+00:00" }),
  makeMatch({ id: "padel-early", startsAt: "2026-11-11T21:00:00+00:00" }),
  makeMatch({
    id: "football",
    sportId: "sport-football",
    sportName: "Football",
    venueName: "Estacion",
  }),
  makeMatch({
    id: "lugo-padel",
    venueName: "Lugo Courts",
    cityName: "Lugo",
  }),
];

export const cities = ["Lugo", "Monforte de Lemos"];
