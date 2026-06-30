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
  sport_id: string | null;
  venue_id?: string | null;
  title?: string | null;
  starts_at?: string | null;
  duration_minutes?: number | null;
  status: string | null;
};

export type MatchCardData = {
  id: string;
  sportName: string;
  title: string;
  startsAt: string;
  durationMinutes: number;
};

export type FindSportMockData = {
  sports?: SportRow[];
  venues?: VenueRow[];
  matches?: MatchRow[];
};
