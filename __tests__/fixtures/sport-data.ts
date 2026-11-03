import type { FindSportMockData } from "../../types/find-game";

export const FOOTBALL = "sport-football";
export const PADEL = "sport-padel";
export const TENNIS = "sport-tennis";

export const sportData: FindSportMockData = {
  sports: [
    { id: FOOTBALL, sportname: "football" },
    { id: PADEL, sportname: "padel" },
    { id: TENNIS, sportname: "tennis" },
    { id: "sport-unnamed", sportname: null },
  ],
  venues: [
    {
      id: "venue-park",
      venuename: "Clapham Common",
      city: "London",
      sport_ids: [FOOTBALL],
    },
    // no sport_ids configured: sports are inferred from matches
    { id: "venue-club", venuename: "Padel Club", city: "London" },
    {
      id: "venue-bristol",
      venuename: "Bristol Courts",
      city: "Bristol",
      sport_ids: [TENNIS],
    },
  ],
  matches: [
    {
      id: "m-late",
      sport_id: FOOTBALL,
      venue_id: "venue-park",
      title: "evening football",
      starts_at: "2026-06-19T18:30:00Z",
      duration_minutes: 90,
      status: "open",
      Attend: "y",
    },
    {
      id: "m-early",
      sport_id: FOOTBALL,
      venue_id: "venue-park",
      title: "morning football",
      starts_at: "2026-06-19T09:00:00Z",
      duration_minutes: 60,
      status: "open",
      Attend: "n",
    },
    {
      id: "m-padel",
      sport_id: PADEL,
      venue_id: "venue-club",
      title: null,
      starts_at: "2026-05-01T10:00:00Z",
      duration_minutes: null,
      status: "open",
      Attend: "y",
    },
    {
      id: "m-full",
      sport_id: PADEL,
      venue_id: "venue-club",
      title: "full padel",
      starts_at: "2026-06-20T10:00:00Z",
      status: "full",
      Attend: "n",
    },
    {
      id: "m-bristol",
      sport_id: TENNIS,
      venue_id: "venue-bristol",
      title: "tennis doubles",
      starts_at: "2026-06-21T10:00:00Z",
      status: "open",
      Attend: "y",
    },
  ],
};
