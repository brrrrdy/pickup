import type { MatchSummary } from "../../types/find-game";
import { supabase } from "../supabase";

const MATCH_COLUMNS = `
  id,
  starts_at,
  duration_minutes,
  max_players,
  notes,
  host_user_id,
  sport:sports (id, name),
  venue:venues (name, city:cities (name, timezone)),
  host:profiles (display_name),
  match_participants (user_id, left_at)
`;

export type MatchRow = {
  id: string;
  starts_at: string;
  duration_minutes: number;
  max_players: number | null;
  notes: string | null;
  host_user_id: string | null;
  sport: { id: string; name: string } | null;
  venue: {
    name: string;
    city: { name: string; timezone: string } | null;
  } | null;
  host: { display_name: string } | null;
  match_participants: { user_id: string | null; left_at: string | null }[];
};

export function mapMatchRow(row: MatchRow, userId: string): MatchSummary {
  const activePlayers = row.match_participants.filter(
    (participant) => participant.left_at === null,
  );

  return {
    id: row.id,
    sportId: row.sport?.id ?? "",
    sportName: row.sport?.name ?? "unknown sport",
    venueName: row.venue?.name ?? "unknown venue",
    cityName: row.venue?.city?.name ?? "unknown city",
    timezone: row.venue?.city?.timezone ?? "UTC",
    startsAt: row.starts_at,
    durationMinutes: row.duration_minutes,
    maxPlayers: row.max_players,
    playerCount: activePlayers.length,
    notes: row.notes,
    hostName: row.host?.display_name ?? null,
    isHost: row.host_user_id !== null && row.host_user_id === userId,
    hasJoined: activePlayers.some(
      (participant) => participant.user_id === userId,
    ),
  };
}

export type MatchTiming = "upcoming" | "past";

/**
 * Scheduled (not cancelled) matches, soonest first for upcoming and most
 * recent first for past.
 */
export async function fetchMatches(
  timing: MatchTiming,
  userId: string,
): Promise<MatchSummary[]> {
  const now = new Date().toISOString();
  const base = supabase
    .from("matches")
    .select(MATCH_COLUMNS)
    .eq("status", "scheduled");

  const query =
    timing === "upcoming"
      ? base.gt("starts_at", now).order("starts_at", { ascending: true })
      : base.lte("starts_at", now).order("starts_at", { ascending: false });

  const { data, error } = await query.returns<MatchRow[]>();
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapMatchRow(row, userId));
}

export async function fetchCityNames(): Promise<string[]> {
  const { data, error } = await supabase
    .from("cities")
    .select("name")
    .order("name");
  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []).map((city) => city.name);
}

async function callMatchRpc(
  fn: "join_match" | "leave_match" | "cancel_match",
  matchId: string,
) {
  const { error } = await supabase.rpc(fn, { p_match_id: matchId });
  if (error) {
    throw new Error(error.message);
  }
}

export const joinMatch = (matchId: string) =>
  callMatchRpc("join_match", matchId);
export const leaveMatch = (matchId: string) =>
  callMatchRpc("leave_match", matchId);
export const cancelMatch = (matchId: string) =>
  callMatchRpc("cancel_match", matchId);
