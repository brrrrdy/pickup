import {
  createMatchFromTemplate,
  mapGameTemplatesForProfile,
} from "../../lib/mappers/mapGameTemplates";
import type { GameTemplateRow } from "../../types/find-game";
import { FOOTBALL, sportData } from "../fixtures/sport-data";

const template: GameTemplateRow = {
  id: "tmpl-1",
  template_name: "after work football",
  sport_id: FOOTBALL,
  venue_id: "venue-park",
  duration_minutes: 90,
  max_players: "open",
  notes: null,
};

describe("mapGameTemplatesForProfile", () => {
  it("resolves sport and venue names", () => {
    expect(
      mapGameTemplatesForProfile({ templates: [template] }, sportData),
    ).toEqual([
      {
        id: "tmpl-1",
        templateName: "after work football",
        sportName: "football",
        location: "Clapham Common, London",
        durationMinutes: 90,
        maxPlayers: "open",
        notes: "",
      },
    ]);
  });

  it("falls back when the sport or venue is unknown", () => {
    const [display] = mapGameTemplatesForProfile(
      {
        templates: [
          { ...template, sport_id: "missing", venue_id: "missing" },
        ],
      },
      sportData,
    );

    expect(display.sportName).toBe("unknown sport");
    expect(display.location).toBe("unknown location");
  });
});

describe("createMatchFromTemplate", () => {
  it("creates an open match from the template", () => {
    const match = createMatchFromTemplate(template, {
      startsAt: "2026-06-19T18:00:00Z",
      createdAt: "2026-06-10T12:00:00Z",
    });

    expect(match).toEqual(
      expect.objectContaining({
        sport_id: FOOTBALL,
        venue_id: "venue-park",
        title: "after work football",
        starts_at: "2026-06-19T18:00:00Z",
        duration_minutes: 90,
        max_players: "open",
        status: "open",
        Attend: "n",
        host_user_id: null,
        created_at: "2026-06-10T12:00:00Z",
      }),
    );
    expect(match.id).toMatch(/^template-match-/);
  });
});
