import type { StartGameOptions } from "../../types/find-game";
import { supabase } from "../supabase";

type SportRow = { id: string; name: string };
type CityRow = { id: string; name: string; timezone: string };
type VenueRow = {
  id: string;
  name: string;
  city_id: string;
  venue_sports: { sport_id: string }[] | null;
};

export function mapStartGameOptions(rows: {
  sports: SportRow[];
  cities: CityRow[];
  venues: VenueRow[];
}): StartGameOptions {
  return {
    sports: rows.sports.map(({ id, name }) => ({ id, name })),
    cities: rows.cities.map(({ id, name, timezone }) => ({
      id,
      name,
      timezone,
    })),
    venues: rows.venues.map((venue) => ({
      id: venue.id,
      name: venue.name,
      cityId: venue.city_id,
      sportIds: (venue.venue_sports ?? []).map((link) => link.sport_id),
    })),
  };
}

export async function fetchStartGameOptions(): Promise<StartGameOptions> {
  const [sports, cities, venues] = await Promise.all([
    supabase.from("sports").select("id, name").order("name"),
    supabase.from("cities").select("id, name, timezone").order("name"),
    supabase
      .from("venues")
      .select("id, name, city_id, venue_sports(sport_id)")
      .eq("is_active", true)
      .order("name"),
  ]);

  const error = sports.error ?? cities.error ?? venues.error;
  if (error) {
    throw new Error(error.message);
  }

  return mapStartGameOptions({
    sports: sports.data ?? [],
    cities: cities.data ?? [],
    venues: venues.data ?? [],
  });
}

export type CreateMatchInput = {
  hostUserId: string;
  sportId: string;
  venueId: string;
  startsAt: string;
  durationMinutes: number;
  maxPlayers: number;
  notes: string;
};

export async function createMatch(
  input: CreateMatchInput,
): Promise<{ id: string }> {
  const notes = input.notes.trim();
  const { data, error } = await supabase
    .from("matches")
    .insert({
      host_user_id: input.hostUserId,
      sport_id: input.sportId,
      venue_id: input.venueId,
      starts_at: input.startsAt,
      duration_minutes: input.durationMinutes,
      max_players: input.maxPlayers,
      notes: notes.length > 0 ? notes : null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
