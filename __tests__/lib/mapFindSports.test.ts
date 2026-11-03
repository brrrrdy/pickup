import {
  mapAttendingMatchesByTime,
  mapOpenMatchesForSelectedSports,
  mapSportsWithOpenGameCounts,
} from "../../lib/mappers/mapFindSports";
import { FOOTBALL, PADEL, TENNIS, sportData } from "../fixtures/sport-data";

describe("mapSportsWithOpenGameCounts", () => {
  it("counts open games per sport in a city and drops sports with none", () => {
    expect(mapSportsWithOpenGameCounts(sportData, "London")).toEqual([
      { id: FOOTBALL, name: "football", availableGames: 2 },
      { id: PADEL, name: "padel", availableGames: 1 },
    ]);
  });

  it("matches the city case-insensitively and ignores text after a comma", () => {
    expect(mapSportsWithOpenGameCounts(sportData, " london, UK ")).toEqual(
      mapSportsWithOpenGameCounts(sportData, "London"),
    );
  });

  it("returns nothing for an unknown or empty city", () => {
    expect(mapSportsWithOpenGameCounts(sportData, "Paris")).toEqual([]);
    expect(mapSportsWithOpenGameCounts(sportData, "")).toEqual([]);
  });
});

describe("mapOpenMatchesForSelectedSports", () => {
  const football = { id: FOOTBALL, name: "football", availableGames: 2 };
  const padel = { id: PADEL, name: "padel", availableGames: 1 };

  it("returns only open matches for the selected sports, earliest first", () => {
    const matches = mapOpenMatchesForSelectedSports(
      sportData,
      [football],
      "London",
    );

    expect(matches.map((match) => match.id)).toEqual(["m-early", "m-late"]);
    expect(matches[0]).toEqual({
      id: "m-early",
      sportName: "football",
      title: "morning football",
      startsAt: "2026-06-19T09:00:00Z",
      durationMinutes: 60,
    });
  });

  it("fills in defaults for missing match fields", () => {
    const [match] = mapOpenMatchesForSelectedSports(
      sportData,
      [padel],
      "London",
    );

    expect(match.title).toBe("open game");
    expect(match.durationMinutes).toBe(0);
  });

  it("returns nothing when no sports are selected", () => {
    expect(mapOpenMatchesForSelectedSports(sportData, [], "London")).toEqual(
      [],
    );
  });

  it("does not include matches from other cities", () => {
    const tennis = { id: TENNIS, name: "tennis", availableGames: 1 };

    expect(
      mapOpenMatchesForSelectedSports(sportData, [tennis], "London"),
    ).toEqual([]);
  });
});

describe("mapAttendingMatchesByTime", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-06-01T00:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns attended future matches, soonest first", () => {
    const matches = mapAttendingMatchesByTime(sportData, "future");

    expect(matches.map((match) => match.id)).toEqual(["m-late", "m-bristol"]);
    expect(matches[0].location).toBe("Clapham Common, London");
    expect(matches[0].sportName).toBe("football");
  });

  it("returns attended past matches, most recent first", () => {
    const matches = mapAttendingMatchesByTime(sportData, "past");

    expect(matches.map((match) => match.id)).toEqual(["m-padel"]);
  });
});
