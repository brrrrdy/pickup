import type {
  CreateMatchFromTemplateInput,
  FindSportMockData,
  GameTemplateMockData,
  GameTemplateRow,
  MatchRow,
  ProfileGameTemplateDisplay,
  SportRow,
  VenueRow,
} from "../components/types/findGame";

function fallbackMatchId() {
  return `template-match-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function mapGameTemplatesForProfile(
  templatesData: GameTemplateMockData,
  sportData: FindSportMockData,
): ProfileGameTemplateDisplay[] {
  const templates = (templatesData.templates ?? []) as GameTemplateRow[];
  const sportsRows = (sportData.sports ?? []) as SportRow[];
  const venueRows = (sportData.venues ?? []) as VenueRow[];

  const sportById = new Map(
    sportsRows.map((sport) => [sport.id, sport.sportname ?? "unknown sport"]),
  );

  const venueById = new Map(
    venueRows.map((venue) => [
      venue.id,
      {
        name: venue.venuename ?? "unknown venue",
        city: venue.city ?? "unknown city",
      },
    ]),
  );

  return templates.map((template) => {
    const venue = venueById.get(template.venue_id);

    return {
      id: template.id,
      templateName: template.template_name,
      sportName: sportById.get(template.sport_id) ?? "unknown sport",
      location: venue ? `${venue.name}, ${venue.city}` : "unknown location",
      durationMinutes: template.duration_minutes,
      maxPlayers: template.max_players,
      notes: template.notes ?? "",
    };
  });
}

export function createMatchFromTemplate(
  template: GameTemplateRow,
  input: CreateMatchFromTemplateInput,
): MatchRow {
  const createdAt = input.createdAt ?? new Date().toISOString();

  return {
    id: fallbackMatchId(),
    host_user_id: input.hostUserId ?? null,
    sport_id: template.sport_id,
    venue_id: template.venue_id,
    title: template.template_name,
    starts_at: input.startsAt,
    duration_minutes: template.duration_minutes,
    max_players: template.max_players,
    status: "open",
    Attend: input.attend ?? "n",
    created_at: createdAt,
  };
}
