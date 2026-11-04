import {
  findCity,
  findSport,
  getCityNames,
  getSportNames,
  getVenuesFor,
} from "../../lib/start-game/options";
import {
  FOOTBALL,
  LUGO,
  MONFORTE,
  PADEL,
  TENNIS,
  startGameOptions,
} from "../fixtures/sport-data";

describe("start game options", () => {
  it("lists sport and city names", () => {
    expect(getSportNames(startGameOptions)).toEqual(["football", "padel"]);
    expect(getCityNames(startGameOptions)).toEqual([
      "Lugo",
      "Monforte de Lemos",
    ]);
  });

  it("finds a sport or city by name", () => {
    expect(findSport(startGameOptions, "padel")?.id).toBe(PADEL);
    expect(findSport(startGameOptions, "curling")).toBeUndefined();
    expect(findCity(startGameOptions, "Lugo")?.id).toBe(LUGO);
  });

  it("filters venues by city and the sports they offer", () => {
    const names = (cityId: string, sportId: string) =>
      getVenuesFor(startGameOptions, cityId, sportId).map((v) => v.name);

    expect(names(MONFORTE, PADEL)).toEqual(["Lemos Padel", "Club Fluvial"]);
    expect(names(MONFORTE, FOOTBALL)).toEqual(["Club Fluvial"]);
    expect(names(LUGO, PADEL)).toEqual(["Lugo Courts"]);
  });

  it("returns no venues for a sport that isn't offered in the city", () => {
    expect(getVenuesFor(startGameOptions, LUGO, FOOTBALL)).toEqual([]);
    expect(getVenuesFor(startGameOptions, MONFORTE, TENNIS)).toEqual([]);
  });

  it("returns no venues until both sport and city are chosen", () => {
    expect(getVenuesFor(startGameOptions, undefined, PADEL)).toEqual([]);
    expect(getVenuesFor(startGameOptions, MONFORTE, undefined)).toEqual([]);
  });
});
