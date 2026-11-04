import {
  getGamesForSports,
  getMatchesInCity,
  getSportsWithGames,
} from "../../lib/find-game/filter";
import { upcomingMatches } from "../fixtures/matches";

describe("find game filters", () => {
  it("matches the city case-insensitively and ignores text after a comma", () => {
    expect(
      getMatchesInCity(upcomingMatches, "monforte de lemos, Spain").length,
    ).toBe(3);
    expect(getMatchesInCity(upcomingMatches, "")).toEqual([]);
  });

  it("counts games per sport in a city, sorted by name", () => {
    expect(getSportsWithGames(upcomingMatches, "Lugo")).toEqual([
      { id: "sport-padel", name: "Padel", availableGames: 1 },
    ]);
    expect(getSportsWithGames(upcomingMatches, "Ourense")).toEqual([]);
  });

  it("returns games for the selected sports only, soonest first", () => {
    const ids = (sportIds: string[]) =>
      getGamesForSports(upcomingMatches, "Monforte de Lemos", sportIds).map(
        (match) => match.id,
      );

    expect(ids(["sport-padel"])).toEqual(["padel-early", "padel-late"]);
    expect(ids(["sport-football"])).toEqual(["football"]);
    expect(ids([])).toEqual([]);
  });
});
