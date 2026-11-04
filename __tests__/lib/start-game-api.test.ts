jest.mock("../../lib/supabase", () => ({ supabase: {} }));

import { mapStartGameOptions } from "../../lib/start-game/api";

describe("mapStartGameOptions", () => {
  it("maps database rows to start game options", () => {
    expect(
      mapStartGameOptions({
        sports: [{ id: "s1", name: "Padel" }],
        cities: [{ id: "c1", name: "Monforte", timezone: "Europe/Madrid" }],
        venues: [
          {
            id: "v1",
            name: "Lemos Padel",
            city_id: "c1",
            venue_sports: [{ sport_id: "s1" }],
          },
          {
            id: "v2",
            name: "No Sports Yet",
            city_id: "c1",
            venue_sports: null,
          },
        ],
      }),
    ).toEqual({
      sports: [{ id: "s1", name: "Padel" }],
      cities: [{ id: "c1", name: "Monforte", timezone: "Europe/Madrid" }],
      venues: [
        { id: "v1", name: "Lemos Padel", cityId: "c1", sportIds: ["s1"] },
        { id: "v2", name: "No Sports Yet", cityId: "c1", sportIds: [] },
      ],
    });
  });
});
