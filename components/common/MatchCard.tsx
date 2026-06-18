import { Text, View } from "react-native";
import type { MatchCardData } from "../types/findGame";

type MatchCardProps = {
  match: MatchCardData;
  location: string;
};

function formatStartTime(startsAt: string): string {
  const parsed = new Date(startsAt);

  if (Number.isNaN(parsed.getTime())) {
    return startsAt;
  }

  return parsed.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MatchCard({ match, location }: MatchCardProps) {
  return (
    <View className="w-full max-w-xl rounded-xl border border-border bg-white p-4">
      <Text className="text-base font-semibold text-defaulttext">
        {match.title}
      </Text>
      <Text className="mt-1 text-sm text-defaulttext">
        sport: {match.sportName}
      </Text>
      <Text className="mt-1 text-sm text-defaulttext">
        starts: {formatStartTime(match.startsAt)}
      </Text>
      <Text className="mt-1 text-sm text-defaulttext">
        duration:{" "}
        {match.durationMinutes > 0 ? `${match.durationMinutes} min` : "tbd"}
      </Text>
      <Text className="mt-1 text-sm text-defaulttext">
        location: {location || "your area"}
      </Text>
    </View>
  );
}
