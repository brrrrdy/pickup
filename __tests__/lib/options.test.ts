import {
  getSportIdByName,
  getValidCities,
  getValidSports,
  getValidVenues,
} from "../../lib/start-game/options";
import { FOOTBALL, PADEL, TENNIS, sportData } from "../fixtures/sport-data";

describe("start game options", () => {
  it("lists named sports only", () => {
    expect(getValidSports(sportData)).toEqual(["football", "padel", "tennis"]);
  });

  it("lists each city once", () => {
    expect(getValidCities(sportData)).toEqual(["London", "Bristol"]);
  });

  it("looks up a sport id by name", () => {
    expect(getSportIdByName(sportData, "padel")).toBe(PADEL);
    expect(getSportIdByName(sportData, "curling")).toBe("");
  });

  it("filters venues by city and configured sports", () => {
    expect(getValidVenues(sportData, "London", FOOTBALL)).toEqual([
      "Clapham Common",
    ]);
    expect(getValidVenues(sportData, "Bristol", TENNIS)).toEqual([
      "Bristol Courts",
    ]);
  });

  it("infers a venue's sports from its matches when none are configured", () => {
    expect(getValidVenues(sportData, "London", PADEL)).toEqual(["Padel Club"]);
  });

  it("returns no venues for a sport that isn't played in the city", () => {
    expect(getValidVenues(sportData, "London", TENNIS)).toEqual([]);
  });
});
