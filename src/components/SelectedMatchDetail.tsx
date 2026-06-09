import { Pressable, Text, View } from "react-native";

import type { Match } from "../types/match";

type SelectedMatchDetailProps = {
  match: Match;
  isJoining: boolean;
  joinStatus: string | null;
  joinStatusKind: "ok" | "error" | null;
  onJoin: () => void;
  onDismiss: () => void;
};

function formatStartsAt(startsAt: string) {
  const date = new Date(startsAt);

  if (Number.isNaN(date.getTime())) {
    return "TBD";
  }

  return date.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} mins`;
  const hours = minutes / 60;
  return hours === Math.floor(hours) ? `${hours}h` : `${hours}h`;
}

export function SelectedMatchDetail({
  match,
  isJoining,
  joinStatus,
  joinStatusKind,
  onJoin,
  onDismiss,
}: SelectedMatchDetailProps) {
  return (
    <View className="mt-5 rounded-2xl border border-primary bg-white p-5">
      <View className="mb-4 flex-row items-start justify-between">
        <Text className="text-[22px] font-extrabold text-foreground">
          {match.sport_name}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onDismiss}
          className="rounded-lg border border-border px-3 py-1.5"
        >
          <Text className="text-[13px] font-semibold text-muted">Close</Text>
        </Pressable>
      </View>

      <View className="mb-3 gap-2">
        <Row label="Venue" value={`${match.venue_name} · ${match.city}`} />
        <Row label="When" value={formatStartsAt(match.starts_at)} />
        <Row label="Duration" value={formatDuration(match.duration_minutes)} />
        <Row
          label="Players"
          value={`${match.joined_players} joined / ${match.max_players} max`}
        />
        <Row label="Host" value={match.host_name} />
      </View>

      <Pressable
        accessibilityRole="button"
        className={`mt-2 min-h-[52px] items-center justify-center rounded-2xl border border-primary bg-foreground ${
          isJoining ? "opacity-70" : ""
        }`}
        disabled={isJoining}
        onPress={onJoin}
      >
        <Text className="text-[16px] font-bold text-primary-foreground">
          {isJoining ? "Joining..." : "Join game"}
        </Text>
      </Pressable>

      {joinStatus ? (
        <View
          className={`mt-3 rounded-xl border bg-white p-3 ${
            joinStatusKind === "error" ? "border-red-200" : "border-border"
          }`}
        >
          <Text
            className={`text-[14px] ${
              joinStatusKind === "error" ? "text-red-700" : "text-foreground"
            }`}
          >
            {joinStatus}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row">
      <Text className="w-24 text-[13px] font-semibold text-muted">{label}</Text>
      <Text className="flex-1 text-[13px] text-foreground">{value}</Text>
    </View>
  );
}
