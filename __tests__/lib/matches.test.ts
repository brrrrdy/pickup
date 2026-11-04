jest.mock("../../lib/supabase", () => ({ supabase: {} }));

import { mapMatchRow, type MatchRow } from "../../lib/matches/api";
import {
  formatMatchTime,
  formatPlayerCount,
  isMatchFull,
} from "../../lib/matches/format";
import { makeMatch } from "../fixtures/matches";

const row: MatchRow = {
  id: "m1",
  starts_at: "2026-11-24T19:00:00+00:00",
  duration_minutes: 90,
  max_players: 4,
  notes: "bring balls",
  host_user_id: "ana",
  sport: { id: "s1", name: "Padel" },
  venue: {
    name: "Pádel'Ante Club",
    city: { name: "Monforte de Lemos", timezone: "Europe/Madrid" },
  },
  host: { display_name: "Ana" },
  match_participants: [
    { user_id: "ana", left_at: null },
    { user_id: "bea", left_at: "2026-11-04T15:00:00+00:00" },
    { user_id: null, left_at: null },
  ],
};

describe("mapMatchRow", () => {
  it("counts only players who haven't left, including deleted users", () => {
    expect(mapMatchRow(row, "ana")).toMatchObject({
      id: "m1",
      sportName: "Padel",
      venueName: "Pádel'Ante Club",
      cityName: "Monforte de Lemos",
      timezone: "Europe/Madrid",
      playerCount: 2,
      hostName: "Ana",
      isHost: true,
      hasJoined: true,
    });
  });

  it("treats a player who left as not joined", () => {
    expect(mapMatchRow(row, "bea")).toMatchObject({
      isHost: false,
      hasJoined: false,
    });
  });

  it("handles a deleted host", () => {
    const orphan = { ...row, host_user_id: null, host: null };
    expect(mapMatchRow(orphan, "ana")).toMatchObject({
      hostName: null,
      isHost: false,
    });
  });
});

describe("match formatting", () => {
  it("shows the start time in the venue's timezone", () => {
    expect(formatMatchTime("2026-11-24T19:00:00+00:00", "Europe/Madrid")).toBe(
      "Tue 24 Nov, 20:00",
    );
  });

  it("shows player counts and whether a game is full", () => {
    expect(formatPlayerCount(makeMatch({ playerCount: 2 }))).toBe(
      "2 / 4 players",
    );
    expect(
      formatPlayerCount(makeMatch({ maxPlayers: null, playerCount: 3 })),
    ).toBe("3 players");
    expect(isMatchFull(makeMatch({ playerCount: 4 }))).toBe(true);
    expect(isMatchFull(makeMatch({ maxPlayers: null, playerCount: 9 }))).toBe(
      false,
    );
  });
});
