export type SportOption = {
  id: string;
  name: string;
  availableGames: number;
};

export type SportRow = {
  id: string;
  sportname: string | null;
};

export type MatchRow = {
  id: string;
  sport_id: string | null;
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
  matches?: MatchRow[];
};
