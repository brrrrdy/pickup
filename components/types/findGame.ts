export type SportOption = {
  id: string;
  name: string;
  availableGames: number;
};

export type SportRow = {
  id: string;
  sportname: string | null;
};

export type VenueRow = {
  id: string;
  city: string;
  venuename?: string | null;
  sport_ids?: string[];
};

export type MatchRow = {
  id: string;
  host_user_id?: string | null;
  sport_id: string | null;
  venue_id?: string | null;
  title?: string | null;
  starts_at?: string | null;
  duration_minutes?: number | null;
  max_players?: number | "open" | null;
  status: string | null;
  Attend?: string | null;
  created_at?: string | null;
};

export type GameTemplateRow = {
  id: string;
  template_name: string;
  sport_id: string;
  venue_id: string;
  duration_minutes: number;
  max_players: number | "open";
  notes?: string | null;
};

export type MatchCardData = {
  id: string;
  sportName: string;
  title: string;
  startsAt: string;
  durationMinutes: number;
};

export type AttendingMatchDisplay = {
  id: string;
  sportName: string;
  title: string;
  startsAt: string;
  displayDateTime: string;
  location: string;
};

export type ProfileGameTemplateDisplay = {
  id: string;
  templateName: string;
  sportName: string;
  location: string;
  durationMinutes: number;
  maxPlayers: number | "open";
  notes: string;
};

export type CreateMatchFromTemplateInput = {
  startsAt: string;
  createdAt?: string;
  hostUserId?: string | null;
  attend?: "y" | "n";
};

export type FindSportMockData = {
  sports?: SportRow[];
  venues?: VenueRow[];
  matches?: MatchRow[];
};

export type GameTemplateMockData = {
  templates?: GameTemplateRow[];
};
